import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { AppBaseComponent } from '@shared/app.base.component';

@Component({
  template: '',
})
export class LogoutComponent
  extends AppBaseComponent
  implements OnInit, OnDestroy
{
  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.permissionService.clearPermssion();
    this.authService.logout().subscribe(() => {
      this.redirect('/login');
    });
  }

  ngOnDestroy(): void {
    this.authService.removeTokenStorage();
  }
}
