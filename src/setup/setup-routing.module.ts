import { ProductFormAddComponent } from './products/product-form-add/product-form-add.component';
import { SizeComponent } from './size/size.component';
import { ColorComponent } from './color/color.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { ProductsComponent } from './products/products.component';
import { CategoryComponent } from './category/category.component';
import { BrandComponent } from './brand/brand.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { PushNotificationsComponent } from './push-notifications/push-notifications.component';
import { UserOrdersComponent } from './user-orders/user-orders.component';
import { OrderDetailsComponent } from './user-orders/order-details/order-details.component';
import { SaleComponent } from './sale/sale.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { ChooseCategoryComponent } from './products/choose-category/choose-category.component';
import { ChooseSubCategoryComponent } from './products/choose-sub-category/choose-sub-category.component';
import { ChooseGenderComponent } from './products/choose-gender/choose-gender.component';
import { RoleGuard } from 'src/auth/role.guard';
import { NewsComponent } from './news/news.component';
import { ChooseSubCategoryUsersComponent } from './sub-category-users/choose-sub-category-users/choose-sub-category-users.component';
import { SubCategoryUsersComponent } from './sub-category-users/sub-category-users/sub-category-users.component';


const routes: Routes = [
  {component: BrandComponent, path: 'brand', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: NewsComponent, path: 'news', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: CategoryComponent, path: 'category', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: ProductsComponent, path: 'product', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: SubCategoryComponent, path: 'sub-category', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: ColorComponent, path: 'color', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: SizeComponent, path: 'size', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: ProductFormAddComponent, path: 'product-form-add/:categoryId/:subCategoryId/:genderId', 
  canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: ProductFormComponent, path: 'product-form/:itemId/:isUpdateMode', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: UsersComponent, path: 'users', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: PushNotificationsComponent, path: 'push-notifications', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: UserOrdersComponent, path: 'user-orders', canActivate: [RoleGuard] ,  data: {expectedRole: 'Admin'} },
  {component: OrderDetailsComponent, path: 'order-details/:orderId', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: SaleComponent, path: 'sale', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: ChooseCategoryComponent, path: 'choose-category', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: ChooseSubCategoryComponent, path: 'choose-sub-category/:categoryId', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: ChooseGenderComponent, path: 'choose-gender/:categoryId/:subCategoryId', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: ChooseSubCategoryUsersComponent, path: 'choose-sub-category-users', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
  {component: SubCategoryUsersComponent, path: 'sub-category-users/:subCategoryId', canActivate: [RoleGuard] ,  data: {expectedRole: 'SuperAdmin'} },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports:[RouterModule]
})
export class SetupRoutingModule {
}