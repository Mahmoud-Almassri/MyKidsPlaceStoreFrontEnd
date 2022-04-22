import { BaseService } from 'src/shared/services/base.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Controllers, Actions } from 'src/shared/global-variables/api-config';
import { NotificationService } from 'src/shared/services/notification.service';
interface DialogData {
  itemId: string;
}
@Component({
  selector: 'app-sale-dialog',
  templateUrl: './sale-dialog.component.html',
  styleUrls: ['./sale-dialog.component.scss']
})
export class SaleDialogComponent implements OnInit {

  saleForm = new FormGroup({
    id: new FormControl(0),
    oldPrice: new FormControl('', Validators.required),
    newPrice: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    status: new FormControl(2, Validators.required),
    itemId: new FormControl()
  });

  getFormControlByName(controlName: string): FormControl {
    return this.saleForm.get(controlName) as FormControl;
  }

  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    public notification: NotificationService,
    public dialogRef: MatDialogRef<SaleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log(this.data);
    if(this.data.itemId){
      this.getFormControlByName('itemId').setValue(this.data.itemId);
    }
  }


  submitForm(): void {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const saleForm = this.saleForm.value;
      console.log(saleForm);
      saleForm.endDate = this.convertToUTC(new Date(saleForm.endDate));
      this.baseService.postItem(Controllers.Sale, Actions.PostSingleSale, saleForm).subscribe(response => {
        this.spinner.hide();
        this.notification.showNotification('Add Sale', 'Sale Added Successfully', 'success');
        this.dialogRef.close();
      }, error => {
        console.log(error);
        if (error.status === 400) {
          this.notification.showNotification('Add Sale Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Add Sale Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.dialogRef.close();
        this.spinner.hide();
      });
    }
  }
  convertToUTC(date: Date): Date {
    if (date) {
      date = new Date(date);
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    } else { return null; }
  }
}
