import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@/environments/environment';

import {
  CreateFutsalTeam,
  EditFutsalTeam,
  FutsalTeamDto,
  QueryFutsalTeam,
} from '../types/football-team';
import { AppBaseService } from './app-base.service';

@Injectable({
  providedIn: 'root',
})
export class FutsalTeamService extends AppBaseService<
  number,
  FutsalTeamDto,
  CreateFutsalTeam,
  EditFutsalTeam,
  QueryFutsalTeam
> {
  constructor(httpClient: HttpClient) {
    super(httpClient, environment.apis.auth.apiPrefix, 'futsal-teams');
  }
}
