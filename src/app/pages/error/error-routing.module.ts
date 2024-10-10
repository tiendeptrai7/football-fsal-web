import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment } from '@angular/router';

import { ErrorComponent } from './error.component';

const routes: Routes = [
  {
    matcher: url => {
      if (url.length === 1 && url[0].path.match(/^[45]0[0-4]$/g)) {
        return {
          consumed: url,
          posParams: {
            code: new UrlSegment(url[0].path, {}),
          },
        };
      }

      return null;
    },
    component: ErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {}
