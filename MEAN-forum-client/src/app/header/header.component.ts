import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy {

  hostURL: string;
  isAuth$ = this.authService.getAuthStatusListener();
  private authSubscription: Subscription;
  private userSubscription: Subscription;
  username: string;
  imgPath: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.hostURL = this.authService.getHostURL();
    this.userSubscription = this.authService.getUserListener()
      .subscribe(userInfo => {
        this.username = userInfo?.username;
        this.imgPath = userInfo?.imgPath;
      })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logoutUser();
    this.username = null;
  }
}
