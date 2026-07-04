import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Role } from './entities';
export const Roles=(...roles:Role[])=>SetMetadata('roles',roles);
@Injectable() export class AuthGuard implements CanActivate {
 constructor(private jwt:JwtService,private reflector:Reflector){}
 canActivate(ctx:ExecutionContext){ const req=ctx.switchToHttp().getRequest(); const raw=req.headers.authorization?.replace('Bearer ',''); if(!raw) throw new UnauthorizedException(); try { req.user=this.jwt.verify(raw); } catch { throw new UnauthorizedException(); } const roles=this.reflector.get<Role[]>('roles',ctx.getHandler()); return !roles||roles.includes(req.user.role); }
}
