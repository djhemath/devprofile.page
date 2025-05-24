import dotenv from 'dotenv';
dotenv.config();

export const Env = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    appBaseUrl: process.env.APP_BASE_URL,
    github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    mongoUri: process.env.MONGO_URI,
    accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
};
