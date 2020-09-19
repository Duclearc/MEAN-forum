import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";
import { Observable, pipe } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    // returns 'true' if user is permitted access to the page
    return this.authService.getAuthStatusListener()
      .pipe(
        tap(authStatus => {
          //if user is not logged in, redirect to login page
          if (!authStatus) {
            this.authService.loadPage('login');
          }
        })
      )
  }
}
