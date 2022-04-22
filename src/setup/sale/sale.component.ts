import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Controllers, Actions } from 'src/shared/global-variables/api-config';
import { BaseService } from 'src/shared/services/base.service';
import { NotificationService } from 'src/shared/services/notification.service';
import { YesNoDialogComponent } from 'src/shared/shared-components/yes-no-dialog/yes-no-dialog.component';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {
  displayedColumns: string[] = ['saleName', 'isActive', 'actions'];
  public isEdit = false;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  public saleList;
  public baseSearch;
  public totalListCount;
  /* 
          public double OldPrice { get; set; }
        public double NewPrice { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? CreatedDate { get; set; }

  */
  saleForm = new FormGroup({
    id: new FormControl(0),
    oldPrice: new FormControl('', Validators.required),
    newPrice: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    status: new FormControl(2, Validators.required)
  });

  getFormControlByName(controlName: string): FormControl {
    return this.saleForm.get(controlName) as FormControl;
  }

  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    private yesNoDialog: MatDialog,
    public notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.getAllSales({ pageSize: 10, pageNumber: 1 });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.getAllSales({ pageSize: 10, pageNumber: 1, name: filterValue });
  }

  check(checked: boolean): void {
    this.getFormControlByName('status').setValue(checked ? 1 : 2);
  }

  toggleStatus(id): void{
    this.baseService.toggleSaleStatus(id).subscribe(res => {
      this.saleList.find(x => x.id === id).status = res.status;
      this.notification.showNotification('Sale ', 'Sale Status Changed Successfully', 'success');
    }, error => {
      this.notification.showNotification('Toggle Status Failed', 'Something went wrong please contact system admin', 'error');
    });
  }
  editItem(element: any): void {
    this.isEdit = true;
    this.saleForm.patchValue(element);
  }
  getAllSales(baseSearch): void {
    this.spinner.show();
    const Controller = Controllers.Sale;
    this.baseService.getList(Controller, baseSearch).subscribe(res => {
      this.saleList = (res as any).entities;
      this.totalListCount = (res as any).totalCount;
      this.dataSource = new MatTableDataSource(this.saleList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1);
      this.spinner.hide();
    });
  }

  deleteItem(sale): void {
    const dialogRef = this.yesNoDialog.open(
      YesNoDialogComponent,
      {
        maxWidth: '400px',
        data:
        {
          title: 'Delete Sale',
          content: 'Are you sure?'
        }
      });
    dialogRef.afterClosed().subscribe(response => {

      if (response) {
        this.spinner.show();
        const Controller = Controllers.Sale;
        this.baseService.removeItem(Controller, sale.id).subscribe(res => {
          this.notification.showNotification('Sale ', 'Sale Deleted Successfully', 'success');
          this.deleteItemFromList(sale.id);
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          if (error.status === 400) {
            this.notification.showNotification('Delete Sale Failed', error.error.Message, 'error');
          }
          else {
            this.notification.showNotification('Delete Sale Failed', 'Something went wrong please contact system admin', 'error');
          }
        });
      }
    });
  }
  changePage(event): void {
    this.getAllSales({ pageSize: event.pageSize, pageNumber: event.pageIndex + 1 });
  }
  submitForm(): void {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const saleForm = this.saleForm.value;
      saleForm.endDate = this.convertToUTC(new Date(saleForm.endDate));
      this.baseService.postItem(Controllers.Sale, Actions.PostItem, saleForm).subscribe(response => {
        this.spinner.hide();
        this.pushItemToList(response);
        this.notification.showNotification('Add Sale', 'Sale Added Successfully', 'success');
        this.cancel();
      }, error => {
        console.log(error);
        if (error.status === 400) {
          this.notification.showNotification('Add Sale Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Add Sale Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }

  cancel(): void {
    this.isEdit = false;
    this.saleForm.reset();

    this.getFormControlByName('status').setValue(2);
    this.getFormControlByName('id').setValue(0);
  }

  pushItemToList(item): void {
    this.saleList.push(item);
  }

  deleteItemFromList(id: number): void {
    this.saleList = this.saleList.filter(sale => sale.id !== id);
  }

  convertToUTC(date: Date): Date {
    if (date) {
      date = new Date(date);
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    } else { return null; }
  }

  editForm(): void {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const saleForm = this.saleForm.value;
      saleForm.endDate = this.convertToUTC(new Date(saleForm.endDate));
      this.baseService.postItem(Controllers.Sale, Actions.EditItem, saleForm).subscribe(response => {
        this.spinner.hide();
        this.deleteItemFromList((response as any).id);
        this.pushItemToList(response);
        this.notification.showNotification('Edit Sale', 'Sale Modified Successfully', 'success');
        this.cancel();
      }, error => {
        console.log(error);
        if (error.status === 400) {
          this.notification.showNotification('Edit Sale Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Edit Sale Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }
}
