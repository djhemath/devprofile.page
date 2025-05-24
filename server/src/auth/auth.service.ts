import { User } from "../models/User";
import { AccessTokenData, GithubUser } from "./auth.types";

export default class AuthService {
    public async createNewUser(user: GithubUser): Promise<AccessTokenData | null> {
        const newUser = new User({
            name: user.name,
            email: user.email,
            picture: user.avatar_url,
            location: user.location,
            bio: user.bio,
            twitter: user.twitter_username,
            roles: ['user'],
        });

        try {
            const savedUser = await newUser.save();


            const accessTokenData: AccessTokenData = {
                id: savedUser.id,
                name: savedUser.name,
                picture: savedUser.picture || '',
                roles: (savedUser.roles as any as string[]) || [],
            };

            return accessTokenData;
        } catch(err) {
            console.log('AuthService :: Error while creating user', err);
            return null;
        }
    }
}
