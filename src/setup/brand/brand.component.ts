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
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {
  displayedColumns: string[] = ['brandName', 'isActive', 'actions'];
  public isEdit = false;
  @ViewChild(MatPaginator, {read: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource <any>;
  public brandList;
  public baseSearch;
  public totalListCount;
  brandForm = new FormGroup({
    id: new FormControl(0),
    brandName: new FormControl('', Validators.required),
    status: new FormControl(2, Validators.required)
  });

  getFormControlByName(controlName: string): FormControl {
    return this.brandForm.get(controlName) as FormControl;
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
    this.getAllBrands({pageSize: 10, pageNumber: 1});
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.getAllBrands({pageSize: 10, pageNumber: 1, name: filterValue});
  }

  check(checked: boolean): void {
    this.getFormControlByName('status').setValue(checked ? 1 : 2);
  }
  // tslint:disable-next-line: no-shadowed-variable
  editItem(element: any): void {
    this.isEdit = true;
    this.brandForm.patchValue(element);
  }
  getAllBrands(baseSearch): void {
    this.spinner.show();
    const Controller = Controllers.Brand;
    this.baseService.getList(Controller, baseSearch).subscribe(res => {
      this.brandList = (res as any).entities;
      this.totalListCount = (res as any).totalCount;
      this.dataSource = new MatTableDataSource(this.brandList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1);
      this.spinner.hide();
    });
  }

  deleteItem(brand): void {
    const dialogRef = this.yesNoDialog.open(
      YesNoDialogComponent,
      {
        maxWidth: '400px',
        data:
        {
          title: 'Delete Brand',
          content:  'Are you sure?'
        }
      });
    dialogRef.afterClosed().subscribe(response => {

      if (response) {
        this.spinner.show();
        const Controller = Controllers.Brand;
        this.baseService.removeItem(Controller, brand.id).subscribe(res => {
          this.notification.showNotification('Brand ', 'Brand Deleted Successfully', 'success');
          this.deleteItemFromList(brand.id);
          this.spinner.hide();
        }, error => {
            this.spinner.hide();
            if (error.status === 400){
              this.notification.showNotification('Delete Brand Failed', error.error.Message, 'error');
            }
            else {
              this.notification.showNotification('Delete Brand Failed', 'Something went wrong please contact system admin', 'error');
            }
        });
      }
    });
}
  changePage(event): void {
    this.getAllBrands({pageSize: event.pageSize, pageNumber: event.pageIndex + 1});
  }
  submitForm(): void {
    if (this.brandForm.invalid){
      this.brandForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const brandForm = this.brandForm.value;
      this.baseService.postItem(Controllers.Brand, Actions.PostItem, brandForm).subscribe(response => {
        this.spinner.hide();
        this.pushItemToList(response);
        this.notification.showNotification('Add Brand', 'Brand Modified Successfully', 'success');
        this.cancel();
      }, error => {
        console.log(error);
        if (error.status === 400){
          this.notification.showNotification('Add Brand Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Add Brand Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }

  cancel(): void{
    this.isEdit = false;
    this.getFormControlByName('status').setValue(2);
    this.getFormControlByName('brandName').setValue('');
    this.getFormControlByName('id').setValue(0);
  }

  pushItemToList(item): void {
    this.brandList.push(item);
  }

  deleteItemFromList(id: number): void{
    this.brandList = this.brandList.filter(brand => brand.id !== id);
  }

  editForm(): void {
    if (this.brandForm.invalid){
      this.brandForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const brandForm = this.brandForm.value;
      this.baseService.postItem(Controllers.Brand, Actions.EditItem, brandForm).subscribe(response => {
        this.spinner.hide();
        this.deleteItemFromList((response as any).id);
        this.pushItemToList(response);
        this.notification.showNotification('Edit Brand', 'Brand Modified Successfully', 'success');
        this.cancel();
      }, error => {
        console.log(error);
        if (error.status === 400){
          this.notification.showNotification('Edit Brand Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Edit Brand Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }
}
