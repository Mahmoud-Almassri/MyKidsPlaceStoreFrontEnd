import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { AngularFireMessaging } from '@angular/fire/messaging';
import { SystemService } from './services/system.service';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  //messaging = firebase.messaging();

  constructor(private angularFireMessaging: AngularFireMessaging ,private systemService:SystemService) {

    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        console.log(_messaging);
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        //_messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
        this.receiveMessage();
      }
    )

    this.angularFireMessaging.tokenChanges.subscribe(() => {
      this.refreshToken()
    });

  }
  refreshToken() {
    this.angularFireMessaging.requestToken.subscribe(response => {
    })
  }
  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        this.systemService.updateFirebaseToken(token).subscribe(res => {
        })
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
        this.currentMessage.subscribe(res => {
          var visit = JSON.parse(res.data.visit)
          if (res.type == 20) {
            this.systemService.showPushNotification(res.notification.englishBody, visit.Id)
          }
          else {
            this.systemService.showPushNotification(res.notification.body, visit.Id)
          }
        }
        )
      })
  }


}