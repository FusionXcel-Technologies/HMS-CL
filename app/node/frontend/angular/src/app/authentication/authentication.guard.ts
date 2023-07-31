import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
  private static readonly allowedRoutes: string[] = ['/auth/signin', '/auth/signup'];

  constructor(private auth: AuthenticationService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const url = state.url;
    return this.auth.isAuthenticated().then((authenticated) => {

      if (authenticated) {
        if (AuthenticationGuard.allowedRoutes.includes(url)) {
          return this.router.navigate(['/home']);
        }
        return true;
      } else {
        if (AuthenticationGuard.allowedRoutes.includes(url)) {
          return true;
        }
        return this.router.navigate(['/auth/signin']);
      }
    }).catch((err) => {
      console.error(err);
      return this.router.navigate(['/auth/signin']);
    });
  }
}
