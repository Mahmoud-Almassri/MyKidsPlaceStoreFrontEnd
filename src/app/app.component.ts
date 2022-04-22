import { AuthorizeService } from './../auth/authorize.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { NavItem } from 'src/shared/models/models';
import { navItems } from 'src/shared/global-variables/menu-items-config';
import { NavService } from './services/nav.service';
import { Router } from '@angular/router';
import { MessagingService } from './firebase-messaging.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MyKidsPlaceStore';
  public isDarkMode = false;
  public navItems: NavItem[] = [];
  public showFlag = false;
  @ViewChild(MatSidenav, { static: false }) sidenav: MatSidenav;
  @ViewChild('menuTrigger', { static: false }) menuTrigger: MatMenuTrigger;
  @ViewChild('sidenav', { static: false }) appDrawer: ElementRef;
  sideNavStatus: boolean | undefined;
  constructor(
    private overlay: OverlayContainer,
    public authorizeService: AuthorizeService,
    private router: Router,
    private messagingService: MessagingService,
    private navService: NavService) {
    this.navItems = navItems;
    const theme = localStorage.getItem('theme');
    if (theme != null) {
      if (theme === 'dark-custom-theme') {
        this.isDarkMode = true;
      }
      this.overlay.getContainerElement().classList.add(theme.toString());
      document.body.classList.add(theme);
    }
    else {
      this.overlay.getContainerElement().classList.add('light-custom-theme');
      document.body.classList.add('light-custom-theme');
    }
    this.initFirebase();
  }
  navigate(route): void {
    this.router.navigate([route]);
    this.navService.closeNav();
  }
  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  toggleTheme(): void {
    try {
      if (this.overlay.getContainerElement().classList.contains('dark-custom-theme')) {
        this.overlay.getContainerElement().classList.remove('dark-custom-theme');
        document.body.classList.remove('dark-custom-theme');
        this.overlay.getContainerElement().classList.add('light-custom-theme');
        document.body.classList.add('light-custom-theme');
        this.isDarkMode = false;
        localStorage.removeItem('theme');
        localStorage.setItem('theme', 'light-custom-theme');

      } else if (this.overlay.getContainerElement().classList.contains('light-custom-theme')) {
        this.overlay.getContainerElement().classList.remove('light-custom-theme');
        this.overlay.getContainerElement().classList.add('dark-custom-theme');
        this.isDarkMode = true;
        localStorage.removeItem('theme');
        localStorage.setItem('theme', 'dark-custom-theme');

      } else {
        this.overlay.getContainerElement().classList.add('light-custom-theme');
        localStorage.removeItem('theme');
        localStorage.setItem('theme', 'light-custom-theme');
        this.isDarkMode = false;

      }
      if (document.body.classList.contains('dark-custom-theme')) {
        document.body.classList.remove('dark-custom-theme');
        document.body.classList.add('light-custom-theme');
        localStorage.removeItem('theme');
        localStorage.setItem('theme', 'light-custom-theme');
        this.isDarkMode = false;


      } else if (document.body.classList.contains('light-custom-theme')) {
        document.body.classList.remove('light-custom-theme');
        document.body.classList.add('dark-custom-theme');
        localStorage.removeItem('theme');
        localStorage.setItem('theme', 'dark-custom-theme');
        this.isDarkMode = true;

      } else {
        document.body.classList.add('light-custom-theme');
        localStorage.removeItem('theme');
        localStorage.setItem('theme', 'light-custom-theme');
        this.isDarkMode = false;
      }
    } catch (e) {
    }
  }
  public initFirebase() {
    this.messagingService.requestPermission();
  }
  IsSidebarOpened(): boolean {
    const isOpened = this.sidenav ? this.sidenav.opened : false;
    return isOpened;
  }

  logout() {
    this.authorizeService.logout();

  }
  toggle(): void {
    this.sidenav.toggle();
    this.sideNavStatus = this.sidenav.opened;
  }
}
