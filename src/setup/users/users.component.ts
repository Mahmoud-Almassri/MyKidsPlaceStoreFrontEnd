import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Controllers } from 'src/shared/global-variables/api-config';
import { BaseService } from 'src/shared/services/base.service';
import { NotificationService } from 'src/shared/services/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['fullName', 'mobileNumber', 'address', 'isActive', 'actions'];

  public isEdit = false;
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  public usersList: any[];
  public baseSearch: any;
  public totalListCount: any;
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
    private yesNoDialog: MatDialog,
    public notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.getAllUsers({
      pageSize: 10,
      pageNumber: 1,
      name: this.getFormControlByName('fullName').value,
      mobileNumber: this.getFormControlByName('mobileNumber').value,
      address: this.getFormControlByName('address').value,
      isActive: this.getFormControlByName('isActive').value,
    });
  }

  applyFilter(): void {
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.getAllUsers({
      pageSize: 10,
      pageNumber: 1,
      name: this.getFormControlByName('fullName').value,
      mobileNumber: this.getFormControlByName('mobileNumber').value,
      address: this.getFormControlByName('address').value,
      isActive: this.getFormControlByName('isActive').value,
    });
  }

  
  updateStatus(userId: number): void {
    this.spinner.show();
    const Controller = Controllers.User;
    this.baseService.updateStatus(Controller, userId).subscribe(res => {
      this.spinner.hide();
      let user = this.usersList.find(user => user.id == userId);
      user.isActive = !user.isActive;
    });
  }
  getAllUsers(baseSearch: { pageSize: any; pageNumber: any; name?: string; mobileNumber?: string; address?: string; isActive?: boolean }): void {
    this.spinner.show();
    const Controller = Controllers.User;
    this.baseService.getList(Controller, baseSearch).subscribe(res => {
      this.usersList = (res as any).entities;
      this.totalListCount = (res as any).totalCount;
      this.dataSource = new MatTableDataSource(this.usersList);
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, 1);
      this.spinner.hide();
    });
  }

  changePage(event: { pageSize: any; pageIndex: number; }): void {
    this.getAllUsers({ pageSize: event.pageSize, pageNumber: event.pageIndex + 1 });
  }
}
