import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateEditNewsComponent } from './create-edit-news/create-edit-news.component';
import { NewsComponent } from './news.component';

const routes: Routes = [
  {
    path: '',
    component: NewsComponent,
    data: {
      title: '',
      permissions: 'news_manage_read',
    },
  },
  {
    path: 'create',
    component: CreateEditNewsComponent,
    data: {
      title: 'Create',
      permissions: 'news_manage_create',
    },
  },
  {
    path: 'edit/:id',
    component: CreateEditNewsComponent,
    data: {
      title: 'Edit',
      permissions: 'news_manage_update',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewsRoutingModule {}
