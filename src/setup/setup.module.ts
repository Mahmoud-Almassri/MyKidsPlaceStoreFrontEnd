import { SaleDialogComponent } from './products/sale-dialog/sale-dialog.component';
import { BulkSaleComponent } from './bulk-sale/bulk-sale.component';
import { ProductFormAddComponent } from './products/product-form-add/product-form-add.component';
import { SizeComponent } from './size/size.component';
import { ColorComponent } from './color/color.component';
import { ProductsComponent } from './products/products.component';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrandComponent } from './brand/brand.component';
import { MaterialModule } from './../app/material.module';
import { SetupRoutingModule } from './setup-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupComponent } from './setup.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { UsersComponent } from './users/users.component';
import { PushNotificationsComponent } from './push-notifications/push-notifications.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { OrdersComponent } from './user-orders/orders/orders.component';
import { OrderDetailsComponent } from './user-orders/order-details/order-details.component';
import { SaleComponent } from './sale/sale.component';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthorizeInterceptor } from 'src/auth/authorize.interceptor';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChooseCategoryComponent } from './products/choose-category/choose-category.component';
import { ChooseSubCategoryComponent } from './products/choose-sub-category/choose-sub-category.component';
import { ChooseGenderComponent } from './products/choose-gender/choose-gender.component';
import { NewsComponent } from './news/news.component';
import { ChooseSubCategoryUsersComponent } from './sub-category-users/choose-sub-category-users/choose-sub-category-users.component';
import { SubCategoryUsersComponent } from './sub-category-users/sub-category-users/sub-category-users.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  imports: [
    CommonModule,
    SetupRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ColorPickerModule,
    MaterialModule,
    NgxGalleryModule,
    FlexLayoutModule,
    NgSelectModule
  ],
  entryComponents: [
    SaleDialogComponent
  ],
  declarations: [
    SetupComponent,
    SaleDialogComponent,
    BrandComponent,
    BulkSaleComponent,
    SubCategoryComponent,
    CategoryComponent,
    ProductsComponent,
    ProductFormComponent,
    ColorComponent,
    SizeComponent,
    ProductFormAddComponent,
    SizeComponent,
    UsersComponent,
    PushNotificationsComponent,
    UserOrdersComponent,
    OrdersComponent,
    OrderDetailsComponent,
    SaleComponent,
    ChooseCategoryComponent,
    ChooseSubCategoryComponent,
    ChooseGenderComponent,
    NewsComponent,
    ChooseSubCategoryUsersComponent,
    SubCategoryUsersComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }
  ],
})
export class SetupModule { }
