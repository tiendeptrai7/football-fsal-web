import { EStatus } from '../constant/enum';
import { BaseModel, BaseQuery } from './base';
import { EventDto } from './event';
import { HcpDto } from './hcp';

export type EventGuestDto = BaseModel & {
  event_id: number;
  hcp_id: number;
  qr_code: string;
  qr_status: EStatus;
  invitation_time_at: Date;
  reply_status: EStatus;
  is_eligible: EStatus;
  event: EventDto;
  hcp: HcpDto;
};

export type QueryEventGuest = BaseQuery & {
  status?: EStatus;
  event_id?: number;
  med_rep_code?: string;
};

export type EditEventGuest = {
  id: number;
  status?: EStatus;
};

export type ImportEventGuestDto = {
  event_id: number;
  key: string;
};
