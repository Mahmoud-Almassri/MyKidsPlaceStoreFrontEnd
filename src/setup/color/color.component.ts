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
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {
  public color = '#1973c0';
  displayedColumns: string[] = ['colorName', 'isActive', 'actions'];
  public isEdit = false;
  @ViewChild(MatPaginator, {read: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource <any>;
  public colorList;
  public baseSearch;
  public totalListCount;
  colorForm = new FormGroup({
    id: new FormControl(0),
    color: new FormControl('', Validators.required),
    status: new FormControl(2, Validators.required)
  });

  getFormControlByName(controlName: string): FormControl {
    return this.colorForm.get(controlName) as FormControl;
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
    this.getAllColors({pageSize: 10, pageNumber: 1});
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.getAllColors({pageSize: 10, pageNumber: 1, name: filterValue});
  }

  check(checked: boolean): void {
    this.getFormControlByName('status').setValue(checked ? 1 : 2);
  }
  editItem(element: any): void {
    this.isEdit = true;
    this.colorForm.patchValue(element);
    this.color = element.color;
  }
  getAllColors(baseSearch): void {
    this.spinner.show();
    const Controller = Controllers.Color;
    this.baseService.getList(Controller, baseSearch).subscribe(res => {
      this.colorList = (res as any).entities;
      this.totalListCount = (res as any).totalCount;
      this.dataSource = new MatTableDataSource(this.colorList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1);
      this.spinner.hide();
    });
  }

  deleteItem(color): void {
    const dialogRef = this.yesNoDialog.open(
      YesNoDialogComponent,
      {
        maxWidth: '400px',
        data:
        {
          title: 'Delete Color',
          content:  'Are you sure?'
        }
      });
    dialogRef.afterClosed().subscribe(response => {

      if (response) {
        this.spinner.show();
        const Controller = Controllers.Color;
        this.baseService.removeItem(Controller, color.id).subscribe(res => {
          this.notification.showNotification('Color ', 'Color Deleted Successfully', 'success');
          this.deleteItemFromList(color.id);
          this.spinner.hide();
        }, error => {
            this.spinner.hide();
            if (error.status === 400){
              this.notification.showNotification('Delete Color Failed', error.error.Message, 'error');
            }
            else {
              this.notification.showNotification('Delete Color Failed', 'Something went wrong please contact system admin', 'error');
            }
        });
      }
    });
}
  changePage(event): void {
    this.getAllColors({pageSize: event.pageSize, pageNumber: event.pageIndex + 1});
  }

  bindColor(): void{
    this.colorForm.get('color').setValue(this.color);
  }
  submitForm(): void {
    if (this.colorForm.invalid){
      this.colorForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const colorForm = this.colorForm.value;
      this.baseService.postItem(Controllers.Color, Actions.PostItem, colorForm).subscribe(response => {
        this.spinner.hide();
        this.pushItemToList(response);
        this.notification.showNotification('Add Color', 'Color Modified Successfully', 'success');
        this.cancel();
      }, error => {
        console.log(error);
        if (error.status === 400){
          this.notification.showNotification('Add Color Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Add Color Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }

  cancel(): void{
    this.isEdit = false;
    this.getFormControlByName('status').setValue(2);
    this.getFormControlByName('color').reset();
    this.getFormControlByName('id').setValue(0);
  }

  pushItemToList(item): void {
    this.colorList.push(item);
  }

  deleteItemFromList(id: number): void{
    this.colorList = this.colorList.filter(color => color.id !== id);
  }

  editForm(): void {
    if (this.colorForm.invalid){
      this.colorForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const colorForm = this.colorForm.value;
      this.baseService.postItem(Controllers.Color, Actions.EditItem, colorForm).subscribe(response => {
        this.spinner.hide();
        this.deleteItemFromList((response as any).id);
        this.pushItemToList(response);
        this.notification.showNotification('Edit Color', 'Color Modified Successfully', 'success');
        this.cancel();
      }, error => {
        console.log(error);
        if (error.status === 400){
          this.notification.showNotification('Edit Color Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Edit Color Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }

}
