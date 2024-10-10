import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditSystemComponent } from '@pages/system/edit/edit-system.component';

import { BreadcrumbResolverService } from '@/app/shared/resolvers/breadcrumb-resolver.service';

import { SystemComponent } from './system.component';

const routes: Routes = [
  {
    path: ':group',
    resolve: {
      title: BreadcrumbResolverService,
    },
    data: {
      typeMapping: {
        SYSTEM_SETTING: 'System Config',
        ZALO: 'Zalo Management',
        EMAIL_SMTP: 'Email SMTP',
      },
    },
    children: [
      {
        path: '',
        component: SystemComponent,
        data: {
          title: '',
          permissions: 'system_manage_read',
        },
      },
      {
        path: 'edit/:id',
        component: EditSystemComponent,
        data: {
          title: 'Update',
          permissions: 'system_manage_update',
        },
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/error/404',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
