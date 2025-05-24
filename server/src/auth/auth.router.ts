import { Router, Request, Response } from 'express';
import { Env } from '../config/env';

const router = Router();


router.get('/github/callback', async (req: Request, res: Response) => {
    const code = req.query.code as string;
    
    if(!code) {
        res.status(400).send('Missing code');
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

        const accessToken = accessTokenQueryParams.get('access_token');

        if(!accessToken) {
            res.status(500).send('Authentication failed');
            return;
        }

        const userRes = await fetch('https://api.github.com/user', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        const user = await userRes.json();

        if(user.status === '401') {
            res.status(500).send('Cannot access user info');
            return;
        }

        

        res.send(`<h2>Welcome, ${user.name || user.login}!</h2><pre>${JSON.stringify(user, null, 2)}</pre>`);
        return;
    } catch(err) {
        console.log('OAuth error: ', err);
        res.status(500).send('Authentication failed');
        return;
    }
});

export default router;