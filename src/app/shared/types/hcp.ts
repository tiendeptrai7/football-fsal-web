import { BaseModel, BaseQuery } from '@shared/types/base';

import { EGender, EHCPType, EStatus } from '../constant/enum';
import { EventGuestDto } from './event-guest';
import { HcoDto } from './hco';
import { MedRepDto } from './med-rep';
import { UserDto } from './user';

export type HcpDto = BaseModel & {
  code: string;
  type: EHCPType;
  name: string;
  dob: Date;
  gender: EGender;
  phone: string;
  specialty: string;
  prefix: string;
  city: string;
  hco_id: number;
  hco: HcoDto;
  user_id: string | null;
  user: UserDto | null;
  ref_id: number;
  ref: HcpDto;
  introduced_guests: HcpDto[];
  medrep_id: string | null;
  medrep: MedRepDto | null;
  event_guest: EventGuestDto[];
};

export type QueryHcpDto = BaseQuery & {
  event_id?: number;
  ref_id?: number;
  type?: EHCPType;
  status?: EStatus;
};
