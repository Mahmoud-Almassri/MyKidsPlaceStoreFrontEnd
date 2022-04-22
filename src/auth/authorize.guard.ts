import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthorizeService } from './authorize.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthorizeGuard implements CanActivate{
    constructor(public auth: AuthorizeService, public router: Router) {
    }

    canActivate(): boolean {
      if (!this.auth.isAuthenticated()) {
        this.router.navigate(['/auth/login']);
        return false;
      }
      return true;
    }
}