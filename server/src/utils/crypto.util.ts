import jwt, { Jwt, JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';

export class CryptoUtils {
  private jwtPrivateKey: string;

  constructor(jwtPrivateKey: string) {
    this.jwtPrivateKey = jwtPrivateKey;
  }

  createJWT(payload: any, expiry=3600): string {
    const options: SignOptions = {
      algorithm: 'HS256',
      expiresIn: expiry,
    };
  
    return jwt.sign(payload, this.jwtPrivateKey, options);
  }
  
  verifyJWT(token: string): string | false | Jwt | JwtPayload {
    const options: VerifyOptions = {
      algorithms: ['HS256'],
    };

    try {
      return jwt.verify(token, this.jwtPrivateKey, options);
    } catch(err) {
      console.log(err);
      return false;
    }
  }
}
