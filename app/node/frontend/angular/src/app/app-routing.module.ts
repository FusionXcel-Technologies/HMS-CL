import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { SignupComponent } from './authentication/signup/signup.component';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignoutComponent } from './authentication/signout/signout.component';
import { ErrorComponent } from './pages/error/error.component';
import { SettingsUsersComponent } from './modules/settings/settings-users/settings-users.component';
import { InventoryManagementCategoriesComponent } from './modules/inventory-management/inventory-management-categories/inventory-management-categories.component';
import { InventoryManagementItemsComponent } from './modules/inventory-management/inventory-management-items/inventory-management-items.component';
import { InventoryManagementRacksComponent } from './modules/inventory-management/inventory-management-racks/inventory-management-racks.component';


const routes: Routes = [
  { path: '', redirectTo: 'home' },
  { path: 'home', title: 'Home', component: HomeComponent, canActivate: [AuthenticationGuard] },
  {
    path: 'auth',
    title: 'Authentication',
    children: [
      { path: 'signup', component: SignupComponent, canActivate: [AuthenticationGuard] },
      { path: 'signin', component: SigninComponent, canActivate: [AuthenticationGuard] },
      { path: 'signout', component: SignoutComponent, canActivate: [AuthenticationGuard] },
    ]
  },
  {
    path: 'inventory-management',
    title: 'Inventory Management',
    canActivate: [AuthenticationGuard],
    children: [
      { path: 'items', component: InventoryManagementItemsComponent },
      { path: 'categories', component: InventoryManagementCategoriesComponent },
      { path: 'racks', component: InventoryManagementRacksComponent },
    ]
  },
  {
    path: 'settings',
    title: 'Settings',
    children: [
      { path: 'users', component: SettingsUsersComponent, canActivate: [AuthenticationGuard] },
    ]
  },
  { path: '404', component: ErrorComponent }, // Add the "Page Not Found" route
  { path: '**', redirectTo: '/404' } // Redirect any other unknown routes to the "Page Not Found" route
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
