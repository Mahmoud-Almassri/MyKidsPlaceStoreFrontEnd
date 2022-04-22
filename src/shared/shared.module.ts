import { MaterialModule } from './../app/material.module';
import { YesNoDialogComponent } from './shared-components/yes-no-dialog/yes-no-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared.component';
import { SimpleNotificationsModule } from 'angular2-notifications';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MaterialModule,
    SimpleNotificationsModule.forRoot()
  ],
  declarations: [
    SharedComponent,
    YesNoDialogComponent
  ]
})
export class SharedModule { }
