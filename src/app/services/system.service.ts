import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Controllers } from 'src/shared/global-variables/api-config';
export const headers = new HttpHeaders({
    "Authorization": `Bearer ${localStorage.getItem("IHospital.access_token")}`,
    'Access-Control-Allow-Origin': '*',
    'Accept-language': 'en',
    'Response-Type': 'Blob'
});

export const notificationToken = new HttpHeaders({
    "Authorization": `Bearer ${localStorage.getItem("IHospital.access_token")}`,
    'Access-Control-Allow-Origin': '*',
    'Accept-language': 'en',
});

@Injectable({
    providedIn: 'root'
})
export class SystemService {
    constructor(
        private http: HttpClient,
        private snackbar: MatSnackBar,
        private router: Router
    ) { }
    baseUrl = environment.apiPreLink;
   
    showPushNotification(message, data) {
        this.snackbar.open("You have new order", "Open", {
            panelClass: ['info']
        }).afterDismissed().subscribe(res => {
            this.router.navigate([`/visits-management/visit-details/requests/${data}`])
        });
    }
    updateFirebaseToken(token) {
        return this.http.get(`${this.baseUrl}${Controllers.Auth}UpdateRegId?regId=${token}`);
    }

}