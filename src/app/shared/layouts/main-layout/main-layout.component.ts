import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { UserService } from '@services/user.service';
import { AppBaseComponent } from '@shared/app.base.component';

@Component({
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent
  extends AppBaseComponent
  implements OnInit, OnDestroy
{
  private scrollListener!: () => void;

  isCollapsed = false;
  scrolling = false;

  constructor(
    injector: Injector,
    private readonly userService: UserService,
    private renderer: Renderer2
  ) {
    super(injector);
  }
  ngOnDestroy(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }

  ngOnInit(): void {
    this.scrollListener = this.renderer.listen('window', 'scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const sticker = document.getElementById('sticker');
      if (scrollTop > 50) {
        console.log('sticker', sticker);
        sticker?.classList.add('is-sticky');
      } else {
        sticker?.classList.remove('is-sticky');
      }
    });

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
