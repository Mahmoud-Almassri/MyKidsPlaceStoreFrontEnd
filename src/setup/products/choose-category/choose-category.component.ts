import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { Controllers } from 'src/shared/global-variables/api-config';
import { BaseService } from 'src/shared/services/base.service';
import { NotificationService } from 'src/shared/services/notification.service';

@Component({
  selector: 'app-choose-category',
  templateUrl: './choose-category.component.html',
  styleUrls: ['./choose-category.component.scss']
})
export class ChooseCategoryComponent implements OnInit {
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  public categoryList;
  public totalListCount;
  public hostLink = environment.host;
  public selectedCategoryId = 0;
  constructor(
    private baseService: BaseService,
    public spinner: NgxSpinnerService,
    private router: Router,
    public notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.getAllCategories();
  }
  getAllCategories(): void {
    this.spinner.show();
    const Controller = Controllers.Category;
    this.baseService.getAllItems(Controller).subscribe(res => {
      this.categoryList = res;
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
      console.log(error);
    });
  }
  public next(categoryId: number) {
    this.selectedCategoryId = categoryId;
    this.router.navigate(['setup/choose-sub-category/' + categoryId]);
  }
}
