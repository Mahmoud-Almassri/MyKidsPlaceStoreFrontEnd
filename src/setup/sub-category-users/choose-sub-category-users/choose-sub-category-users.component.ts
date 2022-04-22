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
  selector: 'app-choose-sub-category-users',
  templateUrl: './choose-sub-category-users.component.html',
  styleUrls: ['./choose-sub-category-users.component.scss']
})
export class ChooseSubCategoryUsersComponent implements OnInit {
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  public subCategoryList;
  public totalListCount;
  public hostLink = environment.host;
  public selectedSubCategoryId = 0;
  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    private router: Router,
    public notification: NotificationService
  ) { }

  ngOnInit(): void {
   this.getAllSubCategories();
  }
  getAllSubCategories(): void {
    this.spinner.show();
    const Controller = Controllers.SubCategory;
    this.baseService.getAllItems(Controller).subscribe(res => {
      this.subCategoryList = res;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }
  public next(subCategoryId: number) {
    this.selectedSubCategoryId = subCategoryId;
    this.router.navigate([`setup/sub-category-users/${this.selectedSubCategoryId}`]);
  }
}
