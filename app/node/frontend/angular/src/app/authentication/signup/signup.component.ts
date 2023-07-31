import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  formData: any = {};
  errors: any = {};
  completedMessage = '';
  // name: string = '';
  field_erros: any = {};
  button_disabled = true;

  constructor(
    private authService: AuthenticationService
    , private router: Router
  ) { }

  ngOnInit(): void {
  }

  disableChange(val: any) {
    if (val.id == 'name') {
      this.field_erros.name = val.has_error;
    } else if (val.id == 'contact_number') {
      this.field_erros.contact_number = val.has_error;
    } else if (val.id == 'password') {
      this.field_erros.password = val.has_error;
    }
    this.button_disabled = Boolean(this.field_erros.name || this.field_erros.contact_number || this.field_erros.password);
  }
  signUp(): void {
    // this.formData.name = this.name;
    this.errors = [];
    this.completedMessage = '';
    this.authService.signUp(this.formData)
      .then((success: boolean) => {
        this.router.navigate(['/home']);
      })
      .catch((error: any) => {
        this.errors = error.error || {};
      });
  }
}
