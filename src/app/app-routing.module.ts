import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@shared/guards/auth.guard';
import { PermissionGuard } from '@shared/guards/permission.guard';
import { BlankLayoutComponent } from '@shared/layouts/blank-layout/blank-layout.component';
import { MainLayoutComponent } from '@shared/layouts/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivateChild: [AuthGuard, PermissionGuard],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('@pages/dashboard/dashboard.module').then(
            x => x.DashboardModule
          ),
      },
      {
        path: 'football-teams',
        loadChildren: () =>
          import('@pages/football-team/football-team.module').then(
            x => x.FootballTeamModule
          ),
      },
      {
        path: 'my-profile',
        loadChildren: () =>
          import('@pages/profile/profile.module').then(x => x.ProfileModule),
      },
      {
        path: 'user',
        loadChildren: () =>
          import('@pages/user/user.module').then(x => x.UserModule),
        data: { title: 'User Management' },
      },
      {
        path: 'role',
        loadChildren: () =>
          import('@pages/role/role.module').then(x => x.RoleModule),
        data: { title: 'Role Management' },
      },
      {
        path: 'hcps',
        loadChildren: () =>
          import('@pages/hcp/hcp.module').then(x => x.HcpModule),
        data: { title: 'HCP Management' },
      },
      {
        path: 'hcos',
        loadChildren: () =>
          import('@pages/hco/hco.module').then(x => x.HcoModule),
        data: {
          title: 'HCO Management',
        },
      },
      {
        path: 'med-reps',
        loadChildren: () =>
          import('@pages/med-rep/med-rep.module').then(x => x.MedRepModule),
        data: { title: 'Med Rep Management' },
      },
      {
        path: 'recaps',
        loadChildren: () =>
          import('@pages/recap/recap.module').then(x => x.RecapModule),
        data: { title: 'Recap Management' },
      },
      {
        path: 'surveys',
        loadChildren: () =>
          import('@pages/survey/survey.module').then(x => x.SurveyModule),
        data: { title: 'Survey Management' },
      },
      {
        path: 'event-forms',
        loadChildren: () =>
          import('@pages/register-form/register-form.module').then(
            x => x.RegisterFormModule
          ),
        data: {
          title: 'Registration Management',
        },
      },
      {
        path: 'feedbacks',
        loadChildren: () =>
          import('@pages/feedback/feedback.module').then(x => x.FeedbackModule),
        data: { title: 'Feedback Management' },
      },
      {
        path: 'system',
        loadChildren: () =>
          import('@pages/system/system.module').then(x => x.SystemModule),
        data: { title: 'Setting' },
      },
      {
        path: 'news',
        loadChildren: () =>
          import('@pages/news/news.module').then(x => x.NewsModule),
        data: { title: 'News Management' },
      },
      {
        path: 'events',
        loadChildren: () =>
          import('@pages/event/event.module').then(x => x.EventModule),
        data: { title: 'Event Management' },
      },
      {
        path: 'event-guest',
        loadChildren: () =>
          import('@pages/event-guest/event-guest.module').then(
            x => x.EventGuestModule
          ),
        data: { title: 'Invitation List' },
      },
      {
        path: 'zalo-messages',
        loadChildren: () =>
          import('@pages/zalo-message/zalo-message.module').then(
            x => x.ZaloMessageModule
          ),
        data: {
          title: 'Zalo Message Report',
        },
      },
      {
        path: 'logs',
        loadChildren: () =>
          import('@pages/log/log.module').then(x => x.LogModule),
        data: { title: 'Log' },
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'error',
        loadChildren: () =>
          import('@pages/error/error.module').then(x => x.ErrorModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('@pages/authenticate/authenticate.module').then(
            x => x.AuthenticateModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/error/404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
