import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss']
})
export class SignoutComponent implements OnInit {
  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.authService.signOut()
    this.router.navigate(['/']);
  }
}
