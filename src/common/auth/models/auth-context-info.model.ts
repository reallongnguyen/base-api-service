import { Role } from './role.enum';

export enum AgentType {
  person = 'person',
  service = 'service',
}

export class AuthContextInfo {
  authId: string;
  agentType: AgentType;
  userId?: string;
  roles: Role[];
  expireAt?: number;

  static fromAuthServiceJwtPayload(obj: any): AuthContextInfo {
    const authCtx = new AuthContextInfo();

    authCtx.authId = obj.sub;
    authCtx.agentType = AgentType.person;
    authCtx.roles = obj.roles || [];
    authCtx.expireAt = obj.exp;

    return authCtx;
  }
}

export function shouldCache(authCtx: AuthContextInfo): boolean {
  if (authCtx.agentType === AgentType.service) {
    return true;
  }

  return authCtx.agentType === AgentType.person && authCtx.userId !== undefined;
}
