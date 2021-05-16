import { UserDetails } from "./userDetails";
import { Request } from "express";

export abstract class UserDetailsService {
    public abstract loadUserDetails(userId: string): UserDetails;
    public abstract resolveUserIdFromRequest(request: Request): string;
}
