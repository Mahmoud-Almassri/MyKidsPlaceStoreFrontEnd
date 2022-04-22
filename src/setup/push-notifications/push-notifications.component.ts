import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Controllers, Actions } from 'src/shared/global-variables/api-config';
import { BaseService } from 'src/shared/services/base.service';
import { NotificationService } from 'src/shared/services/notification.service';

@Component({
  selector: 'app-push-notifications',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['./push-notifications.component.scss']
})
export class PushNotificationsComponent implements OnInit {
  public user = new FormControl();
  public filteredUsers: Observable<any[]>;
  public usersList: any[];
  public mappedUser: any[];
  public usersToSendList: any[];
  public selectedUser: number;
  public tergetedAudience = 3;
  public usersDropList = new FormControl();

  public pushNotificationForm = new FormGroup({
    title: new FormControl(''),
    body: new FormControl(''),
    userId: new FormControl(''),
    usersIds: new FormControl('')
  });

  public getFormControlByName(controlName: string): FormControl {
    return this.pushNotificationForm.get(controlName) as FormControl;
  }

  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    public notification: NotificationService
  ) { }

  public ngOnInit(): void {
    this.getAllUsers();
  }


  public getAllUsers(): void {
    this.spinner.show();
    const Controller = Controllers.User;
    this.baseService.getAllItems(Controller).subscribe(res => {
      this.usersList = res;
     // this.mappedUser = res.map(user => ({ display: user.fullName, value: user.id }))
      this.filteredUsers = this.user.valueChanges
        .pipe(
          startWith(''),
          map(value => this.filter(value))
        );
      this.spinner.hide();
    });
  }
  public userSelectionChange(value) {
    console.log(value);

    this.usersToSendList = value;
    this.getFormControlByName('usersIds').setValue(value);
  }
  private filter(value: any) {
    const filterValue = value.toLowerCase();
    return this.usersList.filter(option => option.fullName.toLowerCase().includes(filterValue));
  }
  userSelected(event) {
    this.selectedUser = this.usersList.find(x => x.fullName == event.option.value).id;
    this.getFormControlByName('userId').setValue(this.selectedUser);
  }

  submitSignleForm(): void {
    if (this.pushNotificationForm.invalid) {
      this.pushNotificationForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const notificationForm = this.pushNotificationForm.value;
      this.baseService
        .postItem(Controllers.Notification, Actions.SendSingleUserNotification + '/' + this.getFormControlByName('userId').value, notificationForm)
        .subscribe(response => {
          this.spinner.hide();
          this.notification.showNotification('Send Notification', 'Notification Sent Successfully', 'success');
        }, error => {
          console.log(error);
          if (error.status === 400) {
            this.notification.showNotification('Send Notification Failed', error.error.Message, 'error');
          }
          else {
            this.notification.showNotification('Send Notification Failed', 'Something went wrong please contact system admin', 'error');
          }
          this.spinner.hide();
        });
    }
  }

  submitAllForm(): void {
    if (this.pushNotificationForm.invalid) {
      this.pushNotificationForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const notificationForm = this.pushNotificationForm.value;
      this.baseService
        .postItem(Controllers.Notification, Actions.PodcastAllUsersNotification + '/1', notificationForm)
        .subscribe(response => {
          this.spinner.hide();
          this.notification.showNotification('Send Notification', 'Notification Sent Successfully', 'success');
        }, error => {
          console.log(error);
          if (error.status === 400) {
            this.notification.showNotification('Send Notification Failed', error.error.Message, 'error');
          }
          else {
            this.notification.showNotification('Send Notification Failed', 'Something went wrong please contact system admin', 'error');
          }
          this.spinner.hide();
        });
    }
  }
  public submitMultiUserForm(): void {
    if (this.pushNotificationForm.invalid) {
      this.pushNotificationForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const notificationForm = this.pushNotificationForm.value;
      this.baseService
        .postItem(Controllers.Notification, Actions.PodcastMultiUsersNotification, notificationForm)
        .subscribe(response => {
          this.spinner.hide();
          this.notification.showNotification('Send Notification', 'Notification Sent Successfully', 'success');
        }, error => {
          console.log(error);
          if (error.status === 400) {
            this.notification.showNotification('Send Notification Failed', error.error.Message, 'error');
          }
          else {
            this.notification.showNotification('Send Notification Failed', 'Something went wrong please contact system admin', 'error');
          }
          this.spinner.hide();
        });
    }
  }
}
