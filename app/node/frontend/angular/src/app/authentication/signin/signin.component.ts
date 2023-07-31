import { Component } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {
  formData: any = {};
  errors: any = {};
  completedMessage = '';
  field_erros: any = {};
  button_disabled = true;

  constructor(
    private authService: AuthenticationService
    , private router: Router
  ) { }

  ngOnInit(): void {
  }

  disableChange(val: any) {
    if (val.id == 'contact_number') {
      this.field_erros.contact_number = val.has_error;
    } else if (val.id == 'password') {
      this.field_erros.password = val.has_error;
    }

    this.button_disabled = Boolean(this.field_erros.contact_number || this.field_erros.password);

  }
  signIn(): void {

    this.errors = { common: [{ message: "Internal Server Error" }] };
    this.completedMessage = 'sd';
    this.authService.signIn(this.formData)
      .then((success: boolean) => {
        this.router.navigate(['/home']);
      })
      .catch((error: any) => {
        this.errors = error.error || {};
      });
  }
}
