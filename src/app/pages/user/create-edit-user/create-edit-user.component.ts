import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SelectOption } from '@components/lazy-select/lazy-select.component';
import { RoleService } from '@services/role.service';
import { UserService } from '@services/user.service';
import { AppBaseComponent } from '@shared/app.base.component';
import { EStatus } from '@shared/constant/enum';
import { EMAIL_REGEX, USER_NAME_REGEX } from '@shared/constant/regex';
import { CreateUser, EditUser } from '@shared/types/user';
import { map } from 'rxjs';

@Component({
  templateUrl: './create-edit-user.component.html',
})
export class CreateEditUserComponent
  extends AppBaseComponent
  implements OnInit
{
  dataSource: SelectOption[] = [];

  validateForm = this.formBuilder.group({
    username: [
      { value: '', disabled: !!this.id },
      [Validators.required, Validators.pattern(USER_NAME_REGEX)],
    ],
    email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
    status: [EStatus.active],
    role_ids: [null as number | null, [Validators.required]],
    profile: this.formBuilder.group({
      full_name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      upi: ['', [Validators.required]],
    }),
  });

  get id(): string {
    return this.getRouteParam<string>('id');
  }

  constructor(
    injector: Injector,
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly roleService: RoleService
  ) {
    super(injector);
  }
  ngOnInit(): void {
    if (this.id) {
      this.userService.getById(this.id).subscribe(user => {
        this.validateForm.patchValue({
          ...user,
          role_ids: +user?.user_roles[0]?.role?.id || null,
          status: user.status ? EStatus.active : EStatus.inactive,
        });
      });
    }
    this.roleService
      .getAll()
      .pipe(
        map(data => {
          return data
            .filter(v => v.slug !== 'user_standard')
            .map(v => {
              return {
                label: `${v.name}`,
                value: v.id,
              } as SelectOption;
            });
        })
      )
      .subscribe(data => (this.dataSource = data));
  }

  goBack() {
    this.redirect('/user');
  }

  save() {
    if (this.validateForm.valid) {
      const body = {
        id: this.id,
        ...this.validateForm.getRawValue(),
        status: this.validateForm.value.status
          ? EStatus.active
          : EStatus.inactive,
        role_ids: [this.validateForm.value.role_ids],
      } as unknown as CreateUser | EditUser;
      this._handleSubmitForm(body, this.id);
    } else {
      this.validateFormGroup(this.validateForm);
    }
  }

  private _handleSubmitForm(body: CreateUser | EditUser, id?: string): void {
    if (id) {
      this.userService.update(<EditUser>body).subscribe(() => {
        this.msgService.success('Update account successful!');
        this.goBack();
      });
    } else {
      this.userService.create(<CreateUser>body).subscribe(() => {
        this.msgService.success('Create account successful!');
        this.goBack();
      });
    }
  }
}
