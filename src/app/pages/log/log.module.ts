import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Highlight } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';

import { SharedModule } from '@/app/shared/shared.module';

import { LogComponent } from './log.component';
import { LogRoutingModule } from './log-routing.module';

@NgModule({
  declarations: [LogComponent],
  imports: [
    CommonModule,
    Highlight,
    HighlightLineNumbers,
    SharedModule,
    LogRoutingModule,
  ],
})
export class LogModule {}
