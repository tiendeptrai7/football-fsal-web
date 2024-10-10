import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@/app/shared/shared.module';

import { FootballTeamComponent } from './football-team.component';
import { FootballTeamRoutingModule } from './football-team-routing.module';

@NgModule({
  declarations: [FootballTeamComponent],
  imports: [CommonModule, SharedModule, FootballTeamRoutingModule],
})
export class FootballTeamModule {}
