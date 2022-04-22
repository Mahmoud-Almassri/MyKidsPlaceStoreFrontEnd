import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent implements OnInit {
  displayedColumns: string[] = ['sizeName', 'isActive', 'actions'];
  public isEdit = false;
  @ViewChild(MatPaginator, {read: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource <any>;
  public sizeList;
  public baseSearch;
  public totalListCount;
  sizeForm = new FormGroup({
    id: new FormControl(0),
    size1: new FormControl('', Validators.required),
    status: new FormControl(2, Validators.required)
  });

  getFormControlByName(controlName: string): FormControl {
    return this.sizeForm.get(controlName) as FormControl;
  }

  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    private authService: AuthorizeService,
    private router: Router,
    private yesNoDialog: MatDialog,
    public notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.getAllSizes({pageSize: 10, pageNumber: 1});
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.getAllSizes({pageSize: 10, pageNumber: 1, name: filterValue});
  }

  check(checked: boolean): void {
    this.getFormControlByName('status').setValue(checked ? 1 : 2);
  }
  editItem(element: any): void {
    this.isEdit = true;
    this.sizeForm.patchValue(element);
  }
  getAllSizes(baseSearch): void {
    this.spinner.show();
    const Controller = Controllers.Size;
    this.baseService.getList(Controller, baseSearch).subscribe(res => {
      this.sizeList = (res as any).entities;
      this.totalListCount = (res as any).totalCount;
      this.dataSource = new MatTableDataSource(this.sizeList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1);
      this.spinner.hide();
    });
  }

  deleteItem(size): void {
    const dialogRef = this.yesNoDialog.open(
      YesNoDialogComponent,
      {
        maxWidth: '400px',
        data:
        {
          title: 'Delete Size',
          content:  'Are you sure?'
        }
      });
    dialogRef.afterClosed().subscribe(response => {

      if (response) {
        this.spinner.show();
        const Controller = Controllers.Size;
        this.baseService.removeItem(Controller, size.id).subscribe(res => {
          this.notification.showNotification('Size ', 'Size Deleted Successfully', 'success');
          this.deleteItemFromList(size.id);
          this.spinner.hide();
        }, error => {
            this.spinner.hide();
            if (error.status === 400){
              this.notification.showNotification('Delete Size Failed', error.error.Message, 'error');
            }
            else {
              this.notification.showNotification('Delete Size Failed', 'Something went wrong please contact system admin', 'error');
            }
        });
      }
    });
}
  changePage(event): void {
    this.getAllSizes({pageSize: event.pageSize, pageNumber: event.pageIndex + 1});
  }
  submitForm(): void {
    if (this.sizeForm.invalid){
      this.sizeForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const sizeForm = this.sizeForm.value;
      this.baseService.postItem(Controllers.Size, Actions.PostItem, sizeForm).subscribe(response => {
        this.spinner.hide();
        this.pushItemToList(response);
        this.notification.showNotification('Add Size', 'Size Modified Successfully', 'success');
        this.cancel();
      }, error => {
        console.log(error);
        if (error.status === 400){
          this.notification.showNotification('Add Size Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Add Size Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }

  cancel(): void{
    this.isEdit = false;
    this.getFormControlByName('status').setValue(2);
    this.getFormControlByName('id').setValue(0);
  }

  pushItemToList(item): void {
    this.sizeList.push(item);
  }

  deleteItemFromList(id: number): void{
    this.sizeList = this.sizeList.filter(size => size.id !== id);
  }

  editForm(): void {
    if (this.sizeForm.invalid){
      this.sizeForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const sizeForm = this.sizeForm.value;
      this.baseService.postItem(Controllers.Size, Actions.EditItem, sizeForm).subscribe(response => {
        this.spinner.hide();
        this.deleteItemFromList((response as any).id);
        this.pushItemToList(response);
        this.notification.showNotification('Edit Size', 'Size Modified Successfully', 'success');
        this.cancel();
      }, error => {
        console.log(error);
        if (error.status === 400){
          this.notification.showNotification('Edit Size Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Edit Size Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }
}
