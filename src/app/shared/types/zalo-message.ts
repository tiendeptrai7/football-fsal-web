import { EStatus, EZaloEventTypes } from '../constant/enum';
import { BaseModel, BaseQuery } from './base';
import { UserDto } from './user';

export type ZaloMessageDto = BaseModel & {
  from_id: string;
  from_display_name: string;
  from_avatar: string;
  to_id: string;
  to_display_name: string;
  to_avatar: string;
  event_name: EZaloEventTypes;
  message_id: string;
  quote_message_id: string;
  message: string;
  timestamp: number;
  attachments: string;
  observe_by: string;
  observer: UserDto;
};

export type QueryZaloMessageDto = BaseQuery & {
  activities?: EStatus;
  observe_by?: string;
  message_type?: string;
  date_range?: Date[];
  date_from?: Date;
  date_to?: Date;
};

export type ObserveMessageDto = {
  comment: string;
  message_ids: number[];
};
