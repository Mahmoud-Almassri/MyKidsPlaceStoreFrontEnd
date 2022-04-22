import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';

const configurations = {
  type: 'success',
  title: 'This is just a title',
  content: 'This is just some content',
  timeOut: 3000,
  showProgressBar: true,
  pauseOnHover: true,
  clickToClose: true,
  animate: 'fromRight'
};
const types = ['alert', 'error', 'info', 'warn', 'success'];
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notifications: NotificationsService) {

  }

  showNotification(title: string, content: string, type: any): void {
    this.notifications.create(title, content, type, configurations);
  }

}
