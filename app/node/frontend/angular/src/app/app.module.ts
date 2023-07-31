import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { ModulesService } from './modules.service';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from './components/components.module';
import { HomeModule } from './home/home.module';
import { ErrorComponent } from './pages/error/error.component';
import { SettingsUsersComponent } from './modules/settings/settings-users/settings-users.component';
import { SettingsUsersBodyComponent } from './modules/settings/settings-users/settings-users-body/settings-users-body.component';
import { InventoryManagementCategoriesComponent } from './modules/inventory-management/inventory-management-categories/inventory-management-categories.component';
import { InventoryManagementItemsComponent } from './modules/inventory-management/inventory-management-items/inventory-management-items.component';
import { InventoryManagementRacksComponent } from './modules/inventory-management/inventory-management-racks/inventory-management-racks.component';


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    SettingsUsersComponent,
    SettingsUsersBodyComponent,
    InventoryManagementCategoriesComponent,
    InventoryManagementItemsComponent,
    InventoryManagementRacksComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthenticationModule,
    HomeModule,
    ComponentsModule,
    FormsModule
  ],
  providers: [
    ModulesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
