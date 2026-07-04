import {createContext,useContext,useMemo,useState,type ReactNode} from'react'
import type{Role}from'./api'
interface Session{token:string;role:Role;email:string}
interface AuthContextValue{session:Session|null;signIn:(session:Session)=>void;signOut:()=>void}
const AuthContext=createContext<AuthContextValue|null>(null),storageKey='narm-session'
export function AuthProvider({children}:{children:ReactNode}){const[session,setSession]=useState<Session|null>(()=>{try{const raw=localStorage.getItem(storageKey);return raw?JSON.parse(raw):null}catch{return null}})
 const value=useMemo(()=>({session,signIn(next:Session){localStorage.setItem(storageKey,JSON.stringify(next));setSession(next)},signOut(){localStorage.removeItem(storageKey);setSession(null)}}),[session])
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>}
export function useAuth(){const context=useContext(AuthContext);if(!context)throw new Error('AuthProvider is missing');return context}
