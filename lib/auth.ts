import { cookies } from 'next/headers';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
const COOKIE='worksafe_session';
export const sessionCookie=COOKIE;
const hash=(s:string)=>createHash('sha256').update(s).digest();
export function validKey(key:string){const expected=process.env.WORKSAFE_ACCESS_KEY;return !!expected && expected.length>=24 && timingSafeEqual(hash(key),hash(expected));}
function signature(payload:string){const secret=process.env.WORKSAFE_SESSION_SECRET;if(!secret||secret.length<32)throw new Error('Sign-in is not configured.');return createHmac('sha256',secret).update(payload).digest('base64url');}
export function createSession(){const payload=Buffer.from(JSON.stringify({owner:'preview-owner',exp:Date.now()+8*60*60*1000})).toString('base64url');return payload+'.'+signature(payload);}
export function verifySession(token:string){try{const [payload,sig,...extra]=token.split('.');if(extra.length||!payload||!sig||!timingSafeEqual(hash(signature(payload)),hash(sig)))return null;const d=JSON.parse(Buffer.from(payload,'base64url').toString());return d.owner==='preview-owner'&&d.exp>Date.now()?{owner:d.owner,actor:process.env.WORKSAFE_OWNER_NAME||'Workspace owner'}:null;}catch{return null;}}
export async function identity(){const jar=await cookies();return verifySession(jar.get(COOKIE)?.value||'');}
