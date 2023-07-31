import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextInputBoxComponent } from './text-input-box/text-input-box.component';
import { RouterModule } from '@angular/router';
import { EmailComponent } from './text-input-box/email/email.component';
//import { ContactNumberComponent } from './text-input-box/contact-number/contact-number.component';
import { PasswordComponent } from './text-input-box/password/password.component';
import { SubmitBtnComponent } from './buttons/submit-btn/submit-btn.component';
import { HeaderComponent } from './header/header.component';
import { LogoComponent } from './header/left/logo/logo.component';
import { SearchbarComponent } from './header/left/searchbar/searchbar.component';
import { SearchInputComponent } from './header/left/searchbar/search-input/search-input.component';
import { SearchButtonComponent } from './header/left/searchbar/search-input/search-button/search-button.component';
import { SearchSuggestionsComponent } from './header/left/searchbar/search-suggestions/search-suggestions.component';
import { SearchSuggestionComponent } from './header/left/searchbar/search-suggestions/search-suggestion/search-suggestion.component';
import { SyncComponent } from './header/right/sync/sync.component';
import { NotificationsComponent } from './header/right/notifications/notifications.component';
import { NotificationComponent } from './header/right/notifications/notification/notification.component';
import { AccountComponent } from './header/right/account/account.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarHeadComponent } from './sidebar/sidebar-head/sidebar-head.component';
import { SidebarMenuComponent } from './sidebar/sidebar-menu/sidebar-menu.component';
import { MenuItemComponent } from './sidebar/sidebar-menu/menu-item/menu-item.component';
import { ChildComponent } from './sidebar/sidebar-menu/menu-item/child/child.component';
import { AdressBarComponent } from './modules/body/adress-bar/adress-bar.component';
import { SmartTableComponent } from './modules/body/smart-table/smart-table.component';
import { DataTableComponent } from './body/data-table/data-table.component';
import { DataTableFindComponent } from './body/data-table/data-table-find/data-table-find.component';
import { DataTableExportComponent } from './body/data-table/data-table-export/data-table-export.component';
import { DataTableTableComponent } from './body/data-table/data-table-table/data-table-table.component';
import { DataTableTableAddItemPopupComponent } from './body/data-table/data-table-table/data-table-table-add-item-popup/data-table-table-add-item-popup.component';
import { DataTableTableUpdateItemPopupComponent } from './body/data-table/data-table-table/data-table-table-update-item-popup/data-table-table-update-item-popup.component';
import { DataTableTableViewItemPopupComponent } from './body/data-table/data-table-table/data-table-table-view-item-popup/data-table-table-view-item-popup.component';
import { DataTableTableDeleteItemPopupComponent } from './body/data-table/data-table-table/data-table-table-delete-item-popup/data-table-table-delete-item-popup.component';
import { RedBtnComponent } from './buttons/red-btn/red-btn.component';
import { SelectComponent } from './inputs/select/select.component';
import { InputSelectSingleComponent } from './inputs/select/input-select-single/input-select-single.component';
import { InputSelectMultipleComponent } from './inputs/select/input-select-multiple/input-select-multiple.component';
import { InputTextComponent } from './inputs/input-text/input-text.component';
import { InputPasswordComponent } from './inputs/input-password/input-password.component';
import { InputNumberComponent } from './inputs/input-number/input-number.component';
import { InputEmailComponent } from './inputs/input-email/input-email.component';
import { InputURLComponent } from './inputs/input-url/input-url.component';
import { InputDateComponent } from './inputs/input-date/input-date.component';
import { InputTimeComponent } from './inputs/input-time/input-time.component';
import { InputCheckboxComponent } from './inputs/input-checkbox/input-checkbox.component';
import { InputRadioComponent } from './inputs/input-radio/input-radio.component';
import { InputFileComponent } from './inputs/input-file/input-file.component';
import { InputHiddenComponent } from './inputs/input-hidden/input-hidden.component';
import { InputColorComponent } from './inputs/input-color/input-color.component';
import { InputRangeComponent } from './inputs/input-range/input-range.component';
import { InputImageComponent } from './inputs/input-image/input-image.component';
import { InputImagesComponent } from './inputs/input-images/input-images.component';




@NgModule({
  declarations: [
    TextInputBoxComponent,
    EmailComponent,

    PasswordComponent,
    SubmitBtnComponent,
    HeaderComponent,
    LogoComponent,
    SearchbarComponent,
    SearchInputComponent,
    SearchButtonComponent,
    SearchSuggestionsComponent,
    SearchSuggestionComponent,
    SyncComponent,
    NotificationsComponent,
    NotificationComponent,
    AccountComponent,
    SidebarComponent,
    SidebarHeadComponent,
    SidebarMenuComponent,
    MenuItemComponent,
    ChildComponent,
    AdressBarComponent,
    SmartTableComponent,
    DataTableComponent,
    DataTableFindComponent,
    DataTableExportComponent,
    DataTableTableComponent,
    DataTableTableAddItemPopupComponent,
    DataTableTableUpdateItemPopupComponent,
    DataTableTableViewItemPopupComponent,
    DataTableTableDeleteItemPopupComponent,
    RedBtnComponent,
    SelectComponent,

    InputSelectSingleComponent,
    InputSelectMultipleComponent,
    InputTextComponent,
    InputPasswordComponent,
    InputNumberComponent,
    InputEmailComponent,
    InputURLComponent,
    InputDateComponent,
    InputTimeComponent,
    InputCheckboxComponent,
    InputRadioComponent,
    InputFileComponent,
    InputHiddenComponent,
    InputColorComponent,
    InputRangeComponent,
    InputImageComponent,
    InputImagesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    TextInputBoxComponent,
    RouterModule,
    SubmitBtnComponent,
    HeaderComponent,
    SidebarComponent,
    AdressBarComponent,
    SmartTableComponent,
    DataTableComponent
  ]
})
export class ComponentsModule { }
