import { environment } from 'src/environments/environment';
import { CategoryCustomService } from './../../shared/services/category-custom.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['categoryName', 'isActive', 'actions'];
  public isEdit = false;
  public selectedFile;
  public hostLink = environment.host;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  public categoryList;
  @ViewChild('fileInput') myInputVariable: ElementRef;
  public totalListCount;
  categoryForm = new FormGroup({
    id: new FormControl(0),
    categoryName: new FormControl('', Validators.required),
    categoryNameAr: new FormControl('', Validators.required),
    imagePath: new FormControl('', Validators.required),
    status: new FormControl(2, Validators.required)
  });

  getFormControlByName(controlName: string): FormControl {
    return this.categoryForm.get(controlName) as FormControl;
  }

  constructor(
    private baseService: BaseService,
    private categoryCustomService: CategoryCustomService,
    public spinner: NgxSpinnerService,
    private authService: AuthorizeService,
    private router: Router,
    private yesNoDialog: MatDialog,
    public notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.getAllCategories({ pageSize: 10, pageNumber: 1 });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getAllCategories({ pageSize: 10, pageNumber: 1, name: filterValue });
  }

  check(checked: boolean): void {
    this.getFormControlByName('status').setValue(checked ? 1 : 2);
  }

  editItem(element: any): void {
    this.isEdit = true;
    this.categoryForm.patchValue(element);
  }

  getAllCategories(baseSearch): void {
    this.spinner.show();
    const Controller = Controllers.Category;
    this.baseService.getList(Controller, baseSearch).subscribe(res => {
      this.categoryList = (res as any).entities;
      this.totalListCount = (res as any).totalCount;
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

  handleFileInput(file): void {
    this.selectedFile = file;
    this.getFormControlByName('imagePath').setValue(file.name);
  }

  clearFileInput(): void {
    this.myInputVariable.nativeElement.value = '';
    this.selectedFile = null;
    this.getFormControlByName('imagePath').setValue('');
  }

  deleteItem(category): void {
    const dialogRef = this.yesNoDialog.open(
      YesNoDialogComponent,
      {
        maxWidth: '400px',
        data:
        {
          title: 'Delete Category',
          content: 'Are you sure?'
        }
      });
    dialogRef.afterClosed().subscribe(response => {

      if (response) {
        this.spinner.show();
        const Controller = Controllers.Category;
        this.baseService.removeItem(Controller, category.id).subscribe(res => {
          this.notification.showNotification('Category ', 'Category Deleted Successfully', 'success');
          this.deleteItemFromList(category.id);
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          if (error.status === 400) {
            this.notification.showNotification('Delete Category Failed', error.error.Message, 'error');
          }
          else {
            this.notification.showNotification('Delete Category Failed', 'Something went wrong please contact system admin', 'error');
          }
        });
      }
    });
  }

  changePage(event): void {
    console.log(event);
    this.getAllCategories({ pageSize: event.pageSize, pageNumber: event.pageIndex + 1 });
  }

  submitForm(): void {
    if (this.categoryForm.invalid || !this.selectedFile) {
      this.categoryForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const categoryForm = this.categoryForm.value;
      this.categoryCustomService.postCategoryWithFile(categoryForm, this.selectedFile).subscribe(response => {
        this.spinner.hide();
        this.pushItemToList(response);
        this.notification.showNotification('Add Category', 'Category Added Successfully', 'success');
        this.cancel();
      }, error => {
        console.log(error);
        if (error.status === 400) {
          this.notification.showNotification('Add Category Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Add Category Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }

  cancel(): void {
    this.isEdit = false;
    this.categoryForm.reset();
    this.getFormControlByName('status').setValue(2);
    this.getFormControlByName('id').setValue(0);
  }

  pushItemToList(item): void {
    this.categoryList.push(item);
  }

  deleteItemFromList(id: number): void {
    this.categoryList = this.categoryList.filter(category => category.id !== id);
  }

  editForm(): void {
    if (this.categoryForm.invalid || !this.selectedFile) {
      this.categoryForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const categoryForm = this.categoryForm.value;
      this.categoryCustomService.updateCategoryWithFile(categoryForm, this.selectedFile).subscribe(response => {
        this.spinner.hide();
        this.deleteItemFromList((response as any).id);
        this.pushItemToList(response);
        this.notification.showNotification('Edit Category', 'Category Modified Successfully', 'success');
        this.cancel();
      }, error => {
        console.log(error);
        if (error.status === 400) {
          this.notification.showNotification('Edit Category Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Edit Category Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }
}
