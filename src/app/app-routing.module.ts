import { DashboardsComponent } from './dashboards/dashboards.component';
import { AuthorizeGuard } from './../auth/authorize.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthModule } from './../auth/auth.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/auth/role.guard';

const routes: Routes = [
  { path: 'setup', loadChildren: () => import('src/setup/setup.module').then(m => m.SetupModule) },
  { path: 'auth', loadChildren: () => import('src/auth/auth.module').then(m => m.AuthModule) },
  { path: 'dashboard', component: DashboardsComponent, canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'}},
  { path: '', component: DashboardsComponent, canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'corrected',
    anchorScrolling: 'enabled',
    useHash: true
  }) ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
