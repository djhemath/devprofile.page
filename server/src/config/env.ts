import dotenv from 'dotenv';
dotenv.config();

export const Env = {
    port: process.env.PORT,
    nodeEnv: process.env.NODE_ENV,
    github: {
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    mongoUri: process.env.MONGO_URI,
};
