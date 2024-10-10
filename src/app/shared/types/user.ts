import { EStatus } from '@shared/constant/enum';
import { BaseModel, BaseQuery } from '@shared/types/base';
import { RoleDto } from '@shared/types/role';

export type UserDto = BaseModel & {
  email: string;
  status: EStatus;
  username: string;
  created_at: Date;
  user_roles: {
    role: RoleDto;
  }[];
  profile: ProfileDto;
  video_count: number;
};

export type ProfileDto = BaseModel & {
  user: UserDto;
  user_id: string;
  full_name: string;
  phone: string;
  zalo_follow_oa_id: string;
};

export type CreateUser = {
  username: string;
  email: string;
  password: string;
  status: EStatus;
  role_id: number;
  profile: ProfileDto;
};

export type EditUser = Partial<CreateUser> & {
  id: string;
};

export type QueryUser = BaseQuery & {
  roles?: string[];
  status?: EStatus;
};

export type QueryCustomerInfo = BaseQuery & {
  date_range?: Date[];
  date_from?: Date;
  date_to?: Date;
};

export type QueryZaloUser = BaseQuery & {
  status?: EStatus;
};
