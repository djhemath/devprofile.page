import { Router, Request, Response } from 'express';

import { Env } from '../config/env';
import { User } from '../models/User';
import { AccessTokenData, GithubUser } from './auth.types';
import AuthService from './auth.service';
import { CryptoUtils } from '../utils/crypto.util';

const router = Router();

// TODO: Refactor this code and separate parts
router.get('/github/callback', async (req: Request, res: Response) => {
    const code = req.query.code as string;
    
    if(!code) {
        return res.redirect(`${Env.appBaseUrl}/auth`);
    }

    try {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: Env.github.clientId,
                client_secret: Env.github.clientSecret,
                code,
            }),
        });

        const accessTokenTextResponse = await tokenRes.text();
        const accessTokenQueryParams = new URLSearchParams(accessTokenTextResponse);

        const githubAccessToken = accessTokenQueryParams.get('access_token');

        if(!githubAccessToken) {
            return res.redirect(`${Env.appBaseUrl}/auth`);
        }

        const userRes = await fetch('https://api.github.com/user', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${githubAccessToken}`,
            }
        });

        const userJSON = await userRes.json();

        if(userJSON.status === '401') {
            return res.redirect(`${Env.appBaseUrl}/auth`);
        }

        let user = userJSON as GithubUser;

        const existingUser = await User.findOne({
            email: user.email,
        });

        let accessTokenData: AccessTokenData | null = null;

        const authService = new AuthService();

        if(!existingUser) {
            // Create new user
            accessTokenData = await authService.createNewUser(user);
        } else {
            accessTokenData = {
                id: existingUser.id,
                name: existingUser.name,
                picture: existingUser.picture || '',
                roles: existingUser.roles as any as string[],
            };
        }

        const cryptoUtil = new CryptoUtils(Env.accessTokenPrivateKey!);

        if(accessTokenData === null) {
            res.status(401).send('auth');
            return;
        }

        const accessToken = cryptoUtil.createJWT(accessTokenData);
        
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
        });

        return res.redirect(Env.appBaseUrl!);
    } catch(err) {
        console.log('OAuth error: ', err);
        return res.redirect(`${Env.appBaseUrl}/auth`);
        return;
    }
});

export default router;