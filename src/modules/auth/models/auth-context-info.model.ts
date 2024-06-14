import { Role } from './role.enum';

class AuthContextInfo {
  authId: string;
  email: string;
  phone: string;
  userId?: string;
  roles: Role[];
  jwtPayload: {
    aud: string;
    exp: number;
    iat: number;
    sub: string;
    email: string;
    phone: string;
    app_metadata: Record<string, any>;
    user_metadata: Record<string, any>;
    role: string;
    aal: string;
    amr: Record<string, any>[];
    session_id: string;
    is_anonymous: boolean;
  };

  static fromJwtPayload(obj: any): AuthContextInfo {
    const authCtx = new AuthContextInfo();

    authCtx.authId = obj.sub;
    authCtx.email = obj.email;
    authCtx.phone = obj.phone;
    authCtx.roles = obj.roles || [];
    authCtx.jwtPayload = obj;

    return authCtx;
  }
}

export default AuthContextInfo;
