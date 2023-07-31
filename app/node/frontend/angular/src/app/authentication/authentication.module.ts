import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { AuthenticationGuard } from './authentication.guard';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ModulesService } from '../modules.service';
import { SigninComponent } from './signin/signin.component';

import { ComponentsModule } from '../components/components.module';
import { SignoutComponent } from './signout/signout.component';




@NgModule({
  declarations: [
    SignupComponent,
    SigninComponent,
    SignoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule
  ],

  providers: [
    AuthenticationService,
    ModulesService,
    AuthenticationGuard
  ]

})
export class AuthenticationModule { }
