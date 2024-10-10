import { EStatus } from '../constant/enum';
import { BaseModel, BaseQuery } from './base';

export type NewsDto = BaseModel & {
  title: string;
  code: string;
  thumbnail: string;
  content: string;
  published_at: Date;
  view: number;
  status: EStatus;
};

export type CreateNews = {
  title: string;
  content: string;
  published_at: Date;
  status: EStatus;
  thumbnail: string;
};

export type EditNews = Partial<CreateNews> & {
  id: number;
};

export type QueryNews = BaseQuery & {
  status?: EStatus;
  date_range?: Date[];
  date_from?: Date;
  date_to?: Date;
};
