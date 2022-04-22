import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
const apiPreLink = environment.apiPreLink;
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

constructor(private httpClient: HttpClient) { }


  public getDashboardData(): Observable<any> {
    return this.httpClient.get(apiPreLink + 'Auth/GetDashboardData' );
  }
}
