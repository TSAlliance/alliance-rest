import { UserDetails } from "./userDetails";
import Express from 'express';

export abstract class UserDetailsService {

    public abstract loadUserDetails(userId: string): UserDetails;
    public abstract resolveUserIdFromRequest(request: Express.Request): string;

}