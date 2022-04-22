import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from './../../shared/services/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit{
  /** Based on the screen size, switch from standard to one column per row */
  public dashboardList;

  constructor(private dashboardService: DashboardService, private spinner: NgxSpinnerService) {}
  ngOnInit(): void {
    this.getDashboardData();
  }

  clearLocalStorage(): void {
    localStorage.clear();
    window.location.reload();
  }
  getDashboardData(): void{
    this.spinner.show();
    this.dashboardService.getDashboardData().subscribe(res => {
      this.dashboardList = res;
      this.spinner.hide();

    }, error => {
      console.log(error);
      this.spinner.hide();
    })
  }


}
