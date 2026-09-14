import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { zones } from '@/lib/model';

async function identity(){
  const user=await getChatGPTUser();
  if(user) return {owner:user.userId,actor:user.displayName};
  if(import.meta.env.DEV) return {owner:'local-preview',actor:'Local preview developer'};
  return null;
}
export async function GET(){
  const user=await identity(); if(!user) return Response.json({error:'Please sign in to save and view your preview records.'},{status:401});
  try {
    const records=await env.DB!.prepare('SELECT * FROM records WHERE owner = ? ORDER BY created_at DESC').bind(user.owner).all();
    const audit=await env.DB!.prepare('SELECT * FROM audits WHERE owner = ? ORDER BY id DESC LIMIT 300').bind(user.owner).all();
    return Response.json({records:records.results.map((r:any)=>({...r,data:JSON.parse(r.data),createdAt:r.created_at})),audit:audit.results,actor:user.actor},{headers:{'Cache-Control':'no-store'}});
  }catch {return Response.json({error:'The record store is unavailable. Changes have not been saved. Please retry.'},{status:503});}
}
export async function POST(request:Request){
  const user=await identity(); if(!user) return Response.json({error:'Sign in is required.'},{status:401});
  if(request.headers.get('origin') && request.headers.get('origin')!==new URL(request.url).origin) return Response.json({error:'Cross-origin write rejected.'},{status:403});
  try {
    const body=await request.text(); if(body.length>250000) throw new Error('Record is too large.');
    const p=JSON.parse(body); const kinds=['worker','inspection','incident','decision','muster','lite','notification'];
    if(!kinds.includes(p.kind)||!zones.some(z=>z.id===p.zone)) throw new Error('Choose a valid record type and zone.');
    if(!p.data||typeof p.data!=='object'||Array.isArray(p.data)) throw new Error('Invalid record.');
    const data=p.data;
    if(typeof data.name!=='string'||!data.name.trim()||data.name.length>140) throw new Error('A name or title of up to 140 characters is required.');
    if(['inspection','incident','decision'].includes(p.kind)&&(!data.notes?.trim()||data.notes.length>4000)) throw new Error('Enter notes (up to 4,000 characters).');
    if(p.kind==='lite'&&(!Number.isFinite(Date.parse(data.expectedReturn))||!data.contact?.trim())) throw new Error('Expected return and a buddy contact are required.');
    const statuses:Record<string,string[]>={worker:['registered','checked-out'],inspection:['completed','deferred','finding-recorded'],incident:['open','acknowledged','investigating','closed-record'],decision:['acknowledged','review-recorded'],muster:['in-progress'],lite:['completed','registered','checked-out'],notification:['simulated-outbox']};
    if(!statuses[p.kind].includes(data.status)) throw new Error('Invalid workflow status.');
    if(p.kind==='inspection'&&!Number.isFinite(Date.parse(data.dueAt))) throw new Error('Original inspection due date is required.');
    if(p.kind==='lite'&&(!Number.isInteger(Number(data.headcount))||Number(data.headcount)<1||Number(data.headcount)>100)) throw new Error('Headcount must be between 1 and 100.');
    const id=typeof p.id==='string'?p.id:crypto.randomUUID(); const now=new Date().toISOString();
    const existing=await env.DB!.prepare('SELECT * FROM records WHERE id = ? AND owner = ?').bind(id,user.owner).first<any>();
    if(p.id&&!existing) throw new Error('Record not found. Refresh and retry.');
    if(existing&&existing.kind!==p.kind) throw new Error('Record type cannot change.');
    if(existing&&['decision','inspection','notification'].includes(p.kind)) throw new Error('This audit record is append-only.');
    if(existing&&p.expectedVersion!==JSON.parse(existing.data).version) return Response.json({error:'This record was changed in another session. Refresh before trying again.'},{status:409});
    if(p.kind==='muster'){
      if(existing){
        if(existing.zone!==p.zone) throw new Error('A muster snapshot cannot change zones.');
        const prior=JSON.parse(existing.data);
        data.members=prior.members.map((m:any)=>m.confirmed?m:data.members?.some((n:any)=>n.id===m.id&&n.confirmed===true)?{...m,confirmed:true,actor:user.actor,at:now}:m);
      }else{
        const crew=await env.DB!.prepare("SELECT id,data FROM records WHERE owner = ? AND zone = ? AND kind = 'worker'").bind(user.owner,p.zone).all<any>();
        data.members=crew.results.filter(r=>JSON.parse(r.data).status!=='checked-out').map(r=>({id:r.id,name:JSON.parse(r.data).name,confirmed:false}));
      }
    }
    data.version=(existing?JSON.parse(existing.data).version||0:0)+1;
    data.label='SIMULATOR PREVIEW RECORD'; data.actor=user.actor;
    const write=existing ? env.DB!.prepare('UPDATE records SET zone = ?, data = ? WHERE id = ? AND owner = ? AND data = ?').bind(p.zone,JSON.stringify(data),id,user.owner,existing.data) : env.DB!.prepare('INSERT INTO records (id,owner,kind,zone,data,created_at) VALUES (?,?,?,?,?,?)').bind(id,user.owner,p.kind,p.zone,JSON.stringify(data),now);
    const audit=env.DB!.prepare('INSERT INTO audits (owner,actor,action,record_id,detail,created_at) SELECT ?,?,?,?,?,? WHERE changes() = 1').bind(user.owner,user.actor,existing?'Updated '+p.kind:'Created '+p.kind,id,JSON.stringify({zone:p.zone,before:existing?JSON.parse(existing.data):null,after:data}),now);
    const result=await env.DB!.batch([write,audit]);
    if(!result[0].meta.changes) return Response.json({error:'Concurrent change detected. Refresh and retry.'},{status:409});
    return Response.json({id},{status:existing?200:201});
  }catch(e){return Response.json({error:e instanceof Error?e.message:'Could not save record.'},{status:400});}
}
