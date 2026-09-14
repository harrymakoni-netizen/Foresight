import {identity} from '@/lib/auth';
import Workspace from './workspace';
import SignIn from './sign-in';
export const dynamic='force-dynamic';
export default async function Page(){return await identity()?<Workspace/>:<SignIn/>;}
