import { SaleDialogComponent } from './sale-dialog/sale-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { Controllers, Actions } from 'src/shared/global-variables/api-config';
import { BaseService } from 'src/shared/services/base.service';
import { NotificationService } from 'src/shared/services/notification.service';
import { YesNoDialogComponent } from 'src/shared/shared-components/yes-no-dialog/yes-no-dialog.component';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public host = environment.host;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  public itemList;
  public baseSearch;
  public totalListCount;
  public imageUrl = environment.imagesUrl;
  public imageSasToken = environment.sasToken;

  filterForm = new FormGroup({
    minPrice: new FormControl('', [Validators.min(1)]),
    maxPrice: new FormControl('', [Validators.min(1)]),
    gender: new FormControl(''),
    brand: new FormControl(''),
    title: new FormControl(''),
    status: new FormControl(''),
    itemId: new FormControl(''),
    subCategoryName: new FormControl(''),
    pageSize: new FormControl(''),
    pageNumber: new FormControl(''),
  });

  getFormControlByName(controlName: string): FormControl {
    return this.filterForm.get(controlName) as FormControl;
  }

  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    private router: Router,
    private yesNoDialog: MatDialog,
    public notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.getFormControlByName('pageNumber').setValue(1)
    this.getFormControlByName('pageSize').setValue(10)

    this.getAllProducts();
  }
  public navigateToAdd() {
    this.router.navigate(['/setup/choose-category'])
  }
  public navigateToEdit(itemId: number) {
    this.router.navigate(['/setup/product-form/' + itemId + '/' + true])
  }
  public navigateToView(itemId: number) {
    this.router.navigate(['/setup/product-form/' + itemId + '/' + false])
  }
  public clearFilters() {
    this.filterForm.reset();
    this.getFormControlByName('pageNumber').setValue(1)
    this.getFormControlByName('pageSize').setValue(10)
    localStorage.removeItem('searchQuery');
    this.applyFilter();
  }
  applyFilter(): void {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    localStorage.setItem('searchQuery', JSON.stringify(this.filterForm.value));
    this.getAllProducts();
  }

  addSale(id): void{
    const dialogRef = this.yesNoDialog.open(SaleDialogComponent, {
      data: {itemId: id}
    });
  }

  getAllProducts(): void {
    this.spinner.show();
    const Controller = Controllers.Item;
    const searchQuery = localStorage.getItem('searchQuery')
    if (searchQuery) {
      this.filterForm.setValue(JSON.parse(searchQuery));
    }

    this.baseService.getFilteredItems(Controller, this.filterForm.value).subscribe(res => {
      this.itemList = (res as any).entities;
      this.totalListCount = (res as any).totalCount;
      this.dataSource = new MatTableDataSource(this.itemList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1);
      this.spinner.hide();
    });
  }
  toggleProducts(from, to) {
    this.baseService.toggleAllItems(from, to).subscribe(response => {
      console.log(response);
      this.notification.showNotification('Product ', 'Products Toggled Successfully', 'success');
    }
      , error => {
        this.notification.showNotification('Toggle Products Failed', '', 'error');
      });
  }
  deleteItem(item): void {
    const dialogRef = this.yesNoDialog.open(
      YesNoDialogComponent,
      {
        maxWidth: '400px',
        data:
        {
          title: 'Delete Item',
          content: 'Are you sure?'
        }
      });
    dialogRef.afterClosed().subscribe(response => {

      if (response) {
        this.spinner.show();
        const Controller = Controllers.Item;
        this.baseService.removeItem(Controller, item.id).subscribe(res => {
          this.notification.showNotification('Item ', 'Item Deleted Successfully', 'success');
          this.deleteItemFromList(item.id);
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          if (error.status === 400) {
            this.notification.showNotification('Delete Item Failed', error.error.Message, 'error');
          }
          else {
            this.notification.showNotification('Delete Item Failed', 'Something went wrong please contact system admin', 'error');
          }
        });
      }
    });
  }
  changePage(event): void {
    this.getFormControlByName('pageSize').setValue(event.pageSize);
    this.getFormControlByName('pageNumber').setValue(event.pageIndex + 1);
    localStorage.setItem('searchQuery', JSON.stringify(this.filterForm.value));
    this.getAllProducts();
  }
  submitForm(): void {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const filterForm = this.filterForm.value;
      this.baseService.postItem(Controllers.Item, Actions.PostItem, filterForm).subscribe(response => {
        this.spinner.hide();
        this.pushItemToList(response);
        this.notification.showNotification('Add Item', 'Item Modified Successfully', 'success');
      }, error => {
        console.log(error);
        if (error.status === 400) {
          this.notification.showNotification('Add Item Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Add Item Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }

  pushItemToList(item): void {
    this.itemList.push(item);
  }

  deleteItemFromList(id: number): void {
    this.itemList = this.itemList.filter(item => item.id !== id);
  }

  editForm(): void {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      this.notification.showNotification('Form Validation', 'Please Check Form Fields', 'warn');
    }
    else {
      this.spinner.show();
      const filterForm = this.filterForm.value;
      this.baseService.postItem(Controllers.Item, Actions.EditItem, filterForm).subscribe(response => {
        this.spinner.hide();
        this.deleteItemFromList((response as any).id);
        this.pushItemToList(response);
        this.notification.showNotification('Edit Item', 'Item Modified Successfully', 'success');
      }, error => {
        console.log(error);
        if (error.status === 400) {
          this.notification.showNotification('Edit Item Failed', error.error.Message, 'error');
        }
        else {
          this.notification.showNotification('Edit Item Failed', 'Something went wrong please contact system admin', 'error');
        }
        this.spinner.hide();
      });
    }
  }

}
