import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { NotificationService } from 'src/shared/services/notification.service';

@Component({
  selector: 'app-choose-gender',
  templateUrl: './choose-gender.component.html',
  styleUrls: ['./choose-gender.component.scss']
})
export class ChooseGenderComponent implements OnInit {
  @ViewChild(MatPaginator, { read: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  public subCategoryList;
  public totalListCount;
  public hostLink = environment.host;
  public selectedGenderId: number;
  public selectedSubCategoryId: number;
  public selectedCategoryId: number;
  constructor(
    public spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
    public notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedCategoryId=params.categoryId;
      this.selectedSubCategoryId=params.subCategoryId;
    });
  }
  public next(genderId: number) {
    this.selectedGenderId = genderId;
    this.router.navigate([`setup/product-form-add/${this.selectedCategoryId}/${this.selectedSubCategoryId}/${genderId}`]);
  }
}
