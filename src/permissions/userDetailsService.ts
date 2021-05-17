import { UserDetails } from "./userDetails";
import { Request } from "express";

export abstract class UserDetailsService {
    public abstract loadUserDetails(userId: string, token?: object): Promise<UserDetails>;
    public abstract resolveUserIdFromRequest(request: Request): [string, object];
}
