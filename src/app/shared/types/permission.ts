import { BaseModel } from '@shared/types/base';
import { RoleDto } from '@shared/types/role';

export type Permission = BaseModel & {
  name: string;
  slug: string;
  module: string;
  position: number;
  permission_roles: PermissionRole;
};

export type ListPermissionDto = {
  [key: string]: PermissionItem[];
};

export type PermissionItem = {
  id: number;
  name: string;
  slug?: string;
  checked?: boolean;
  position?: number;
};

export type PermissionRole = BaseModel & {
  role: RoleDto;
  permission: Permission;
};
