import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CreateEditNewsComponent } from './create-edit-news/create-edit-news.component';
import { NewsComponent } from './news.component';
import { NewsRoutingModule } from './news-routing.module';

@NgModule({
  declarations: [NewsComponent, CreateEditNewsComponent],
  imports: [CommonModule, SharedModule, NewsRoutingModule],
})
export class NewsModule {}
