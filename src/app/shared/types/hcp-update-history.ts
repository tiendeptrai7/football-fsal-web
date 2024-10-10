import { EHcpUpdateType } from '../constant/enum';
import { BaseModel } from './base';
import { HcpDto } from './hcp';

export type HcpUpdateHistory = BaseModel & {
  old_value: string;
  new_value: string;
  type: EHcpUpdateType;
  hcp_id: number;
  hcp: HcpDto;
};
