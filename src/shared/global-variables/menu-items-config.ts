import { NavItem } from '../models/models';

export const navItems: NavItem[] = [
      {
        displayName: 'Dashboard',
        route: '/dashboard',
        icon: 'analytics'
      },
      {
        displayName: 'News',
        route: '/news',
        icon: 'feed'
      },
      {
        displayName: 'Brand',
        route: '/setup/brand',
        icon: 'polymer'
      },
      {
        displayName: 'Categories',
        route: '/setup/category',
        icon: 'category'
      },
      {
        displayName: 'Sub Categories',
        route: '/setup/sub-category',
        icon: 'subdirectory_arrow_right'
      },
       {
        displayName: 'Sub Categories Users',
        route: '/setup/choose-sub-category-users',
        icon: 'subdirectory_arrow_right'
      },
      {
        displayName: 'Products',
        route: '/setup/product',
        icon: 'shopping_cart'
      },
      {
        displayName: 'Sale',
        route: '/setup/sale',
        icon: 'local_offer'
      },
      {
        displayName: 'User Orders',
        route: '/setup/user-orders',
        icon: 'list_alt'
      },
      {
        displayName: 'Users',
        route: '/setup/users',
        icon: 'person_pin'
      },
      {
        displayName: 'Change Password',
        route: '/auth/change-password',
        icon: 'person_pin'
      },
      {
        displayName: 'Push Notifications',
        route: '/setup/push-notifications',
        icon: 'notifications_active'
      }
];
