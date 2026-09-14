import { cookies } from 'next/headers';
import { validKey, createSession, sessionCookie } from '@/lib/auth';
export const runtime='nodejs';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Cross-origin sign-in rejected.'},{status:403});
 try{const body=await request.text();if(body.length>1024)return Response.json({error:'Invalid access key.'},{status:400});const data=JSON.parse(body);if(typeof data.key!=='string'||!validKey(data.key))return Response.json({error:'The access key is incorrect.'},{status:401});
 (await cookies()).set(sessionCookie,createSession(),{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',maxAge:28800,path:'/'});
 return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Sign-in is unavailable. Please retry.'},{status:503});}
}
export async function DELETE(request:Request){if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Cross-origin request rejected.'},{status:403});(await cookies()).delete(sessionCookie);return Response.json({ok:true});}
