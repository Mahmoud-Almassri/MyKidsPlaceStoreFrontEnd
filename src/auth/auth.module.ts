import { ChangePasswordComponent } from './change-password/change-password.component';
import { environment } from './../environments/environment';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './../app/material.module';
import { AuthRouting } from './auth-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { ReactiveFormsModule, FormGroup, FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRouting,
    
  ],
  declarations: [
    LoginComponent,
    ChangePasswordComponent,
    AuthComponent

  ]
})
export class AuthModule { }
