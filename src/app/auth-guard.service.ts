import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot } from '@angular/router';
import { FirebaseService } from './_data/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }


  checkLogin(url: string): boolean {
    if (this.firebaseService.isLoggedIn) { return true; }

    this.firebaseService.redirectUrl = url;

    this.router.navigate(['/login']);
    return false;
  }
}