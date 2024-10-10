import { EPosition, EStatus } from '../constant/enum';
import { BaseModel, BaseQuery } from './base';

export type FutsalTeamDto = BaseModel & {
  name: string;
  thumbnail?: string;
  code: string;
  content: string;
  status: EStatus;
  players?: PlayerDto[];
  team_leader_id?: number;
  team_leader?: PlayerDto;
  established_year?: number;
};

export type PlayerDto = BaseModel & {
  name: string;
  team_id: number;
  first_name: string;
  last_name: string;
  nationality: string;
  position: EPosition;
  birth_date: Date;
  status: EStatus;
  futsal_team: FutsalTeamDto;
  team_leader?: FutsalTeamDto;
};

export type CreateFutsalTeam = {};

export type EditFutsalTeam = Partial<CreateFutsalTeam> & {
  id: number;
};

export type QueryFutsalTeam = BaseQuery & {
  status?: EStatus;
  date_range?: Date[];
  date_from?: Date;
  date_to?: Date;
};
