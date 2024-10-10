import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@/app/shared/shared.module';

import { HcoComponent } from './hco.component';
import { HcoRoutingModule } from './hco-routing.module';

@NgModule({
  declarations: [HcoComponent],
  imports: [CommonModule, SharedModule, HcoRoutingModule],
})
export class HcoModule {}
