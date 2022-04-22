import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { Actions, Controllers } from 'src/shared/global-variables/api-config';
import { BaseService } from 'src/shared/services/base.service';
import { NotificationService } from 'src/shared/services/notification.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  public isEdit = false;
  public order: any;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public imageUrl = environment.imagesUrl;
  public imageSasToken = environment.sasToken;
  dataSource: MatTableDataSource<any>;
  public itemsList: any[];
  public baseSearch: any;
  public totalListCount: any;
  public orderId: number;
  filterForm = new FormGroup({
    fullName: new FormControl(''),
    mobileNumber: new FormControl(''),
    address: new FormControl(''),
    isActive: new FormControl('')
  });

  getFormControlByName(controlName: string): FormControl {
    return this.filterForm.get(controlName) as FormControl;
  }

  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    public notification: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(param => {
      this.orderId = param.orderId;
    })
    this.getOrderDetails();
  }

  applyFilter(): void {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.getOrderDetails();
  }


  updateStatus(): void {
    this.spinner.show();
    const Controller = Controllers.Order;
    const orderUpdate = {
      Id: this.order.id,
      Status: this.order.status,
      CreatedBy:this.order.createdBy,
      CreatedDate:this.order.createdDate,
      TotalAmount:this.order.totalAmount
    }
    this.baseService.postItem(Controller, Actions.EditItem, orderUpdate).subscribe(res => {
      this.spinner.hide();
      this.notification.showNotification('Order Status ', 'Order Status Changed Successfully', 'success');
    }, error => {
      this.spinner.hide();
      this.notification.showNotification('Order Status ', error.error.Message, 'error');
    });
  }
  getOrderDetails(): void {
    this.spinner.show();
    const Controller = Controllers.Order;
    this.baseService.getById(Controller, this.orderId).subscribe(res => {
      this.order = res;
      this.itemsList = res.cartItem;
      this.totalListCount = (res as any).totalCount;
      this.dataSource = new MatTableDataSource(res.cartItem);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1);
      this.spinner.hide();
    });
  }
  public navigateToEdit(itemId: number) {
    this.router.navigate(['/setup/product-form/' + itemId + '/' + true])
  }
  public navigateToView(itemId: number) {
    this.router.navigate(['/setup/product-form/' + itemId + '/' + false])
  }

}
