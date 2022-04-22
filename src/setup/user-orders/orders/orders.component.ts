import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Controllers } from 'src/shared/global-variables/api-config';
import { BaseService } from 'src/shared/services/base.service';
import { NotificationService } from 'src/shared/services/notification.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  @Input() public isActiveOrders: boolean;

  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  public ordersList: any[];
  public baseSearch: any;
  public totalListCount: any;
  public isPrintEnabled = false;
  filterForm = new FormGroup({
    orderId: new FormControl(''),
    fromDate: new FormControl(''),
    toDate: new FormControl(''),
    totalAmount: new FormControl(''),
    isActive: new FormControl('')
  });

  getFormControlByName(controlName: string): FormControl {
    return this.filterForm.get(controlName) as FormControl;
  }

  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    public notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.getAllOrders({
      pageSize: 10,
      pageNumber: 1,
      id: this.getFormControlByName('orderId').value,
      fromDate: this.getFormControlByName('fromDate').value,
      toDate: this.getFormControlByName('toDate').value,
      isActive: this.getFormControlByName('isActive').value,
      totalAmount: this.getFormControlByName('totalAmount').value,
    });
  }
  public clearFilters() {
    this.filterForm.reset();
    localStorage.removeItem('orderSearchQuery');
    this.applyFilter();
  }
  applyFilter(): void {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    localStorage.setItem('orderSearchQuery', JSON.stringify(this.filterForm.value));

    this.getAllOrders({
      pageSize: 10,
      pageNumber: 1,
      id: this.getFormControlByName('orderId').value,
      fromDate: this.getFormControlByName('fromDate').value,
      toDate: this.getFormControlByName('toDate').value,
      isActive: this.getFormControlByName('isActive').value,
      totalAmount: this.getFormControlByName('totalAmount').value
    });
  }


  updateStatus(userId: number): void {
    this.spinner.show();
    const Controller = Controllers.User;
    this.baseService.updateStatus(Controller, userId).subscribe(res => {
      this.spinner.hide();
      const user = this.ordersList.find(user => user.id == userId);
      user.isActive = !user.isActive;
    });
  }
  getAllOrders(baseSearch:
    {
      pageSize: any;
      pageNumber: any;
      id?: number;
      totalAmount?: number;
      fromDate?: string;
      toDate?: string;
      isActive?: boolean;
    }): void {
    this.spinner.show();
    const Controller = Controllers.Order;
    const orderSearchQuery = JSON.parse(localStorage.getItem('orderSearchQuery'));
    if (orderSearchQuery) {
      this.getFormControlByName('orderId').setValue(orderSearchQuery.orderId);
      this.getFormControlByName('fromDate').setValue(orderSearchQuery.fromDate);
      this.getFormControlByName('toDate').setValue(orderSearchQuery.toDate);
      this.getFormControlByName('totalAmount').setValue(orderSearchQuery.totalAmount);
      baseSearch.id = orderSearchQuery.orderId;
      baseSearch.fromDate = orderSearchQuery.fromDate;
      baseSearch.toDate = orderSearchQuery.toDate;
      baseSearch.isActive = orderSearchQuery.isActive;
      baseSearch.totalAmount = orderSearchQuery.totalAmount;
    }
    this.baseService.getList(Controller, baseSearch).subscribe(res => {
      this.ordersList = (res as any).entities;
      this.totalListCount = (res as any).totalCount;
      this.dataSource = new MatTableDataSource(this.ordersList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1);
      this.spinner.hide();
    });
  }
  public tabSelectionChanged(event) {
  }
  changePage(event: { pageSize: any; pageIndex: number; }): void {
    this.getAllOrders({
      pageSize: event.pageSize, pageNumber: event.pageIndex + 1,
    });
  }
  printPage() {
    // window.print();
    this.isPrintEnabled = true;
    setTimeout(() => {
      let printContents, popupWin;
      printContents = document.getElementById('print-section').innerHTML;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
      );
      popupWin.document.close();
      this.isPrintEnabled = false;
    }, 500);

  }

}
