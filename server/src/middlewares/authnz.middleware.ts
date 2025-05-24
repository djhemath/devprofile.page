import type { Request, Response, NextFunction } from "express";
import { CryptoUtils } from "../utils/crypto.util";
import { Response as AppResponse } from "../utils/response.util";
import { Env } from "../config/env";
import { AccessTokenData } from "../auth/auth.types";

const accessTokenCryptoUtil = new CryptoUtils(Env.accessTokenPrivateKey!);

export function authNZ(expectedRoles: string[], shouldAllRolesRequired: boolean = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.access_token;

    if(!token) return sendUnauthorizedResponse(res);
    
    const payload = accessTokenCryptoUtil.verifyJWT(token);

    if(!payload || typeof payload === 'string') return sendUnauthorizedResponse(res);

    // By now, the access token is valid and not expired. So the authentication is completed.
    const accessToken = payload as AccessTokenData;

    // Authorization
    const roles = accessToken.roles;

    let areRolesSatisfied: boolean;

    if(shouldAllRolesRequired) {
      areRolesSatisfied = expectedRoles.every(expectedRole => roles.includes(expectedRole));
    } else {
      areRolesSatisfied = expectedRoles.some(expectedRole => roles.includes(expectedRole));
    }

    if(areRolesSatisfied) {
      if(!req.body) {
        req.body = {};
      }

      req.body.payload = payload;
      return next();
    } else {
      return sendUnauthorizedResponse(res);
    }
  }
}

export function sendUnauthorizedResponse(res: Response) {
  const response = AppResponse.withoutData().toUnauthorizedResponse();
  res.status(response.status).json(response);
}
