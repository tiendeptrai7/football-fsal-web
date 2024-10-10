import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { NzResultModule } from 'ng-zorro-antd/result';

import { ErrorComponent } from './error.component';
import { ErrorRoutingModule } from './error-routing.module';

@NgModule({
  declarations: [ErrorComponent],
  imports: [SharedModule, ErrorRoutingModule, NzResultModule],
})
export class ErrorModule {}
