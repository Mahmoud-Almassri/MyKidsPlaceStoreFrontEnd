import { Router } from '@angular/router';
import { AuthorizeService } from './../authorize.service';
import { NotificationService } from './../../shared/services/notification.service';
import { Actions, Controllers } from './../../shared/global-variables/api-config';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseService } from 'src/shared/services/base.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm = new FormGroup({
    mobileNumber: new FormControl('', Validators.required),
    newPassword: new FormControl('', Validators.required)
  });

  getFormControlByName(controlName: string): FormControl {
    return this.changePasswordForm.get(controlName) as FormControl;
  }

  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    private authService: AuthorizeService,
    private router: Router,
    public notification: NotificationService
  ) { }

  ngOnInit(): void {
  }

  submitForm(): void {
    if (this.changePasswordForm.invalid){

    }
    else {
      this.spinner.show();
      const changePasswordForm = this.changePasswordForm.value;
      this.baseService.postItem(Controllers.Auth, Actions.ChangePasswordFromAdmin, changePasswordForm).subscribe(response => {
        this.spinner.hide();
        this.notification.showNotification('Password Changed', 'Password Changed Successfully', 'success');
      }, error => {
        console.log(error);
        this.notification.showNotification('Login Failed', 'Something went wrong please contact system admin', 'error');
        this.spinner.hide();
      });
    }
  }
}
