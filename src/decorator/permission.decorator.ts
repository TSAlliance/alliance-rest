import { applyDecorators, SetMetadata } from "@nestjs/common";
import { PERMISSION_KEY } from "./canRead.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";

// Applying multiple permissions can be considered as an OR check statement
// So if one permission applies to the user, he is considered granted
export const Permission = (...permission: any[]) => {
    return applyDecorators(SetMetadata(PERMISSION_KEY, permission), ApiBearerAuth ? ApiBearerAuth() : undefined);
};
