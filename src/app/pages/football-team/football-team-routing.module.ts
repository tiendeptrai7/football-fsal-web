import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FootballTeamComponent } from './football-team.component';

const routes: Routes = [
  {
    path: '',
    component: FootballTeamComponent,
    data: {
      title: '',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FootballTeamRoutingModule {}
