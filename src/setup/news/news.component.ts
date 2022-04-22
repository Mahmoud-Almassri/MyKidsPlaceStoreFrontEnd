import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthorizeService } from 'src/auth/authorize.service';
import { Controllers, Actions } from 'src/shared/global-variables/api-config';
import { BaseService } from 'src/shared/services/base.service';
import { NotificationService } from 'src/shared/services/notification.service';
import { YesNoDialogComponent } from 'src/shared/shared-components/yes-no-dialog/yes-no-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  newsForm = new FormGroup({
    id: new FormControl(0),
    newsDescription: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required)
  });

  getFormControlByName(controlName: string): FormControl {
    return this.newsForm.get(controlName) as FormControl;
  }

  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    public notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.getNews();
  }

 
  getNews(): void {
    this.spinner.show();
    const Controller = Controllers.News;
    this.baseService.getNews(Controller).subscribe(res => {
      this.newsForm.patchValue(res);
      this.spinner.hide();
    });
  }

  
  
  submitForm(): void {
    if (this.newsForm.invalid){
      this.newsForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const newsForm = this.newsForm.value;
      this.baseService.postItem(Controllers.News, Actions.EditItem, newsForm).subscribe(response => {
        this.spinner.hide();
        this.notification.showNotification('Modify news', 'News Modified Successfully', 'success');
      }, error => {
        console.log(error);
        if (error.status === 400){
          this.notification.showNotification('Modify news Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Modify news Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }
}
