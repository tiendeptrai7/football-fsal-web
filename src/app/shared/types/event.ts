import { EStatus } from '../constant/enum';
import { BaseModel, BaseQuery } from './base';
import { EventGuestDto } from './event-guest';
import { FeedbackDto } from './feedback';
import { RecapDto } from './recap';
import { CreateReminder, EditReminder, ReminderDto } from './reminder';
import { SurveyDto } from './survey';

export type EventDto = BaseModel & {
  name: string;
  code: string;
  content: string;
  image_url: string;
  location: string;
  started_at: Date;
  ended_at: Date;
  invite_expire_days: number;
  invite_days_before: number;
  invite_send_at: Date;
  invite_expire_at: Date;
  is_public: EStatus;
  status: EStatus;
  event_guest: EventGuestDto[];
  reminders: ReminderDto[];
  recaps: RecapDto[];
  feedbacks: FeedbackDto[];
  surveys: SurveyDto[];
};

export type CreateEvent = {
  name: string;
  content: string;
  image_url: string;
  location: string;
  started_at: Date;
  ended_at: Date;
  invite_days_before: number;
  invite_expire_days: number;
  invite_send_at: Date;
  invite_expire_at: Date;
  is_public: EStatus;
  status: EStatus;
  reminders: CreateReminder[];
};

export type EditEvent = {
  id: number;
  name?: string;
  content?: string;
  image_url?: string;
  location?: string;
  started_at?: Date;
  ended_at?: Date;
  invite_days_before?: number;
  invite_expire_days?: number;
  invite_send_at?: Date;
  invite_expire_at?: Date;
  is_public?: EStatus;
  status?: EStatus;
  reminders?: EditReminder[];
};

export type QueryEvent = BaseQuery & {
  is_public?: EStatus;
  date_range?: Date[];
  date_from?: Date;
  date_to?: Date;
};

export type QueryEventRelatedHcp = {
  hcp_id?: number;
};

export enum EStatusString {
  active = 'active',
  inactive = 'inactive',
  pending = 'pending',
}
