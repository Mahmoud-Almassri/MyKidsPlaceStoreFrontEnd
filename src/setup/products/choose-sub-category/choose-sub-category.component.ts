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
  selector: 'app-choose-sub-category',
  templateUrl: './choose-sub-category.component.html',
  styleUrls: ['./choose-sub-category.component.scss']
})
export class ChooseSubCategoryComponent implements OnInit {
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  public subCategoryList;
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
      this.selectedCategoryId = params.categoryId;
      this.getAllSubCategories(params.categoryId);
    });
  }
  getAllSubCategories(categoryId): void {
    this.spinner.show();
    const Controller = Controllers.SubCategory;
    this.baseService.getByParentId(Controller, categoryId).subscribe(res => {
      this.subCategoryList = res;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }
  public next(subCategoryId: number) {
    this.selectedSubCategoryId = subCategoryId;
    this.router.navigate([`setup/choose-gender/${this.selectedCategoryId}/${this.selectedSubCategoryId}`]);
  }
}
