import { BaseModel, BaseQuery } from '@shared/types/base';

import { EStatus } from '../constant/enum';
import { UserDto } from './user';

export type MedRepDto = BaseModel & {
  code: string;
  name: string;
  phone: string;
  email: string | null;
  business_unit: string;
  status: EStatus;
  user_id: string | null;
  user: UserDto | null;
};

export type QueryMedRepDto = BaseQuery & {
  match_phone?: EStatus;
};
