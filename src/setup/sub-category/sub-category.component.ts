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
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  displayedColumns: string[] = ['subCategoryName', 'isActive', 'actions'];
  public isEdit = false;
  @ViewChild(MatPaginator, {read: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource <any>;
  public subCategoryList;
  public categoryList;
  public totalListCount;
  subCategoryForm = new FormGroup({
    id: new FormControl(0),
    categoryId: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    nameAr: new FormControl('', Validators.required),
    description: new FormControl(''),
    createdDate: new FormControl(''),
    modifiedDate: new FormControl(''),
    noGenderClassification: new FormControl(''),
    orderNumber: new FormControl(''),
    status: new FormControl(2, Validators.required)
  });

  getFormControlByName(controlName: string): FormControl {
    return this.subCategoryForm.get(controlName) as FormControl;
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
    this.getAllCategories();
    this.getAllSubCategorys({pageSize: 10, pageNumber: 1});

  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getAllSubCategorys({pageSize: 10, pageNumber: 1, name: filterValue});

  }

  check(checked: boolean): void {
    this.getFormControlByName('status').setValue(checked ? 1 : 2);
  }
  editItem(element: any): void {
    this.isEdit = true;
    this.subCategoryForm.patchValue(element);
  }

  getAllCategories(): void {
    this.spinner.show();
    const Controller = Controllers.Category;
    this.baseService.getAllItems(Controller).subscribe(res => {
      this.categoryList = res;
      this.dataSource = new MatTableDataSource(this.categoryList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }

  getAllSubCategorys(baseSearch): void {
    this.spinner.show();
    const Controller = Controllers.SubCategory;
    this.baseService.getList(Controller, baseSearch).subscribe(res => {
      this.subCategoryList = (res as any).entities;
      this.totalListCount = (res as any).totalCount;
      this.dataSource = new MatTableDataSource(this.subCategoryList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1);
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }

  deleteItem(subCategory): void {
    const dialogRef = this.yesNoDialog.open(
      YesNoDialogComponent,
      {
        maxWidth: '400px',
        data:
        {
          title: 'Delete SubCategory',
          content:  'Are you sure?'
        }
      });
    dialogRef.afterClosed().subscribe(response => {

      if (response) {
        this.spinner.show();
        const Controller = Controllers.SubCategory;
        this.baseService.removeItem(Controller, subCategory.id).subscribe(res => {
          this.notification.showNotification('SubCategory ', 'SubCategory Deleted Successfully', 'success');
          this.deleteItemFromList(subCategory.id);
          this.spinner.hide();
        }, error => {
            this.spinner.hide();
            if (error.status === 400){
              this.notification.showNotification('Delete SubCategory Failed', error.error.Message, 'error');
            }
            else {
              this.notification.showNotification('Delete SubCategory Failed', 'Something went wrong please contact system admin', 'error');
            }
        });
      }
    });
}
  changePage(event): void {
    this.getAllSubCategorys({pageSize: event.pageSize, pageNumber: event.pageIndex + 1});
  }
  submitForm(): void {
    if (this.subCategoryForm.invalid){
      this.subCategoryForm.markAllAsTouched();
    }
    else {
      this.spinner.show();
      const subCategoryForm = this.subCategoryForm.value;
      this.baseService.postItem(Controllers.SubCategory, Actions.PostItem, subCategoryForm).subscribe(response => {
        this.spinner.hide();
        this.pushItemToList(response);
        this.notification.showNotification('Add SubCategory', 'SubCategory Modified Successfully', 'success');
        this.cancel();
      }, error => {
        console.log(error);
        if (error.status === 400){
          this.notification.showNotification('Add SubCategory Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Add SubCategory Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }

  cancel(): void{
    this.isEdit = false;
    this.subCategoryForm.reset();
    this.getFormControlByName('status').setValue(2);
    this.getFormControlByName('id').setValue(0);
  }

  pushItemToList(item): void {
    this.subCategoryList.push(item);
  }

  deleteItemFromList(id: number): void{
    this.subCategoryList = this.subCategoryList.filter(subCategory => subCategory.id !== id);
  }

  editForm(): void {
    if (this.subCategoryForm.invalid){
      this.subCategoryForm.markAllAsTouched();
    }
    else {
      this.spinner.show();
      const subCategoryForm = this.subCategoryForm.value;
      this.baseService.postItem(Controllers.SubCategory, Actions.EditItem, subCategoryForm).subscribe(response => {
        this.spinner.hide();
        this.deleteItemFromList((response as any).id);
        this.pushItemToList(response);
        this.notification.showNotification('Edit SubCategory', 'SubCategory Modified Successfully', 'success');
        this.cancel();
      }, error => {
        console.log(error);
        if (error.status === 400){
          this.notification.showNotification('Edit SubCategory Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Edit SubCategory Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }
}
