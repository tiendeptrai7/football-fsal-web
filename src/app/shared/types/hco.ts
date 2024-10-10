import { EStatus } from '../constant/enum';
import { BaseModel } from './base';
import { HcpDto } from './hcp';

export type HcoDto = BaseModel & {
  code: string;
  name: string;
  status: EStatus;
  hcps: HcpDto[];
};

export type EventRelatedHCPDto = BaseModel & {
  name: string;
  checked_in_at: Date;
};
