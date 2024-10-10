import { Component, Injector, OnInit } from '@angular/core';
import { UserDto } from '@shared/types/user';
import { getFirstCharacter } from '@utils/string';
import { AppBaseComponent } from 'src/app/shared/app.base.component';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  templateUrl: './profile.component.html',
})
export class ProfileComponent extends AppBaseComponent implements OnInit {
  user!: UserDto;
  constructor(
    injector: Injector,
    private readonly userService: UserService
  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe(data => {
      this.user = data;
    });
  }

  protected readonly getFirstCharacter = getFirstCharacter;
}
