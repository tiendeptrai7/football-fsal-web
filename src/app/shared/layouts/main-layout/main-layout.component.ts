import { Component, Injector, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { AppBaseComponent } from '@shared/app.base.component';

@Component({
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent extends AppBaseComponent implements OnInit {
  isCollapsed = false;

  constructor(
    injector: Injector,
    private readonly userService: UserService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    if (localStorage.getItem('is_change_password')) {
      return this.redirect('/change-password');
    }

    this.userService.getMyProfile().subscribe(data => {
      const tmp = {
        username: data?.username,
        name: data?.profile?.full_name || data?.username,
        role: data.user_roles[0]?.role?.name || '',
      };

      if (
        JSON.stringify(tmp) !==
        JSON.stringify(this.userService.userSimpleProfile)
      ) {
        this.userService.userSimpleProfile = { ...tmp };
      }
    });
  }
}
