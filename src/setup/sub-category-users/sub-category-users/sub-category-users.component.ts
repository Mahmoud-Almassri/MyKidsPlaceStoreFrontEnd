import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { Controllers } from 'src/shared/global-variables/api-config';
import { BaseService } from 'src/shared/services/base.service';
import { NotificationService } from 'src/shared/services/notification.service';

@Component({
  selector: 'app-sub-category-users',
  templateUrl: './sub-category-users.component.html',
  styleUrls: ['./sub-category-users.component.scss']
})
export class SubCategoryUsersComponent implements OnInit {
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  public searchValue: string;
  public users;
  public totalListCount;
  public hostLink = environment.host;
  public selectedSubCategoryId = 0;
  public selectedCategoryId = 0;
  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    public notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getSubCategoryUsers(params.subCategoryId);
    })
  }
  getSubCategoryUsers(subCategoryId: number): void {
    this.spinner.show();
    const Controller = Controllers.Order;
    this.baseService.getSubCategoryUsers(Controller, subCategoryId).subscribe(res => {
      this.users = res;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }
  public filterUsers(filterValue: any) {
    this.users.filter = filterValue.key.trim().toLowerCase();
  }
}
