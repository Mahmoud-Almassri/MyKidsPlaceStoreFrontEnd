import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

    constructor(public jwtHelper: JwtHelperService, private router: Router) {}

    public isAuthenticated(): boolean {
        const token = localStorage.getItem(environment.token);
        // Check whether the token is expired and return
        // true or false
        if (token){
            return !this.jwtHelper.isTokenExpired(token);
        }
        return false;
      }

    /**
     * setToken
     */
    // tslint:disable-next-line: typedef
    public setToken(token: string) {
        localStorage.setItem(environment.token, token);
    }

    public logout(){
        localStorage.removeItem(environment.token);
        this.router.navigate(['/auth/login']);
    }

    get loggedInUser(): string {
        const token = localStorage.getItem(environment.token);
        if (token && !this.jwtHelper.isTokenExpired(token)) {
            return token;
        }
        return null;
    }
}
