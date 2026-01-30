import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (permission: string) =>
  SetMetadata(PERMISSIONS_KEY, permission);
