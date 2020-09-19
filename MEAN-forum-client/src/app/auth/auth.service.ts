import { Injectable } from "@angular/core";
import { User, UserLoginData, UserProfileData } from './user.model';
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";


@Injectable({ providedIn: 'root' })

export class AuthService {

  private hostURL: string = 'http://localhost:3000';
  private apiURL: string = this.hostURL + '/api/users';
  private token: string = null;
  private expiry: string = null;
  emptyUser: UserProfileData = {
    id: null,
    username: null,
    imgPath: null,
  }
  private user = new BehaviorSubject<UserProfileData>(null);
  private authStatusListener = new BehaviorSubject<boolean>(false);
  private loadingStatusListener = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }

  getHostURL() {
    return this.hostURL;
  }

  setUser() { //! Must always be called after this.token has been assigned!
    this.http.get<{ user: UserProfileData }>(this.apiURL + '/me')
      .subscribe(response => {
        this.user.next(response.user);
      })
  }

  getUserListener() {
    return this.user.asObservable();
  }

  getToken() {
    return this.token;
  }

  loadPage(path: string = '') {
    this.loadingStatusListener.next(true);
    this.router.navigate(['/' + path]);
    this.loadingStatusListener.next(false);
  }

  getLoadingStatusListener() {
    return this.loadingStatusListener.asObservable();
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  authenticateUser() {
    this.loadingStatusListener.next(true);
    const session = JSON.parse(localStorage.getItem('session'));
    if (session) {
      this.token = session.token;
      this.expiry = session.expiry;
      this.setUser();
    }

    const now = new Date();
    const expiryDate = new Date(this.expiry);

    if (this.token && expiryDate >= now) {
      this.authStatusListener.next(true);
      this.loadingStatusListener.next(false);
      return
    } else {
      const clearStorage = session ? true : false; //"is this the user's first login?"
      this.logoutUser(clearStorage);
    }
  }

  createUser(user: User, imgFile: File = null) {
    this.loadingStatusListener.next(true);
    const userData = new FormData();
    userData.append("username", user.username);
    userData.append("email", user.email);
    userData.append("password", user.password);
    if (imgFile) {
      userData.append("imgFile", imgFile, Math.random().toString());
    }

    this.http.post<{ message: string, user: User }>(this.apiURL + '/register', userData)
      .subscribe(
        responseData => {
          console.log(responseData.message);

          //login new user
          const newUser: UserLoginData = {
            email: user.email,
            password: user.password
          }
          this.loginUser(newUser);
        },
        err => {
          alert('This email address is taken');
          console.log(err);
        }
      )
  }

  loginUser(user: UserLoginData) {
    this.loadingStatusListener.next(true);
    this.http.post<{ message: string, token: string, userId: string }>(this.apiURL + '/login', user)
      .subscribe(
        responseData => {
          //setting up the expiry date
          const now = new Date();
          const expiryHour = now.getHours() + 1;
          now.setHours(expiryHour);
          const expiryTime = now.toISOString();

          //storing values
          const session = JSON.stringify({
            expiry: expiryTime,
            token: responseData.token,
          });
          localStorage.setItem('session', session);
          this.token = responseData.token;
          this.setUser();

          //sending feedback
          console.log(responseData.message);
          this.authStatusListener.next(true);
          this.loadPage();
        },
        err => {
          alert('Oh, oh. Was there a typo somewhere?');
          console.log(err);
          this.loadingStatusListener.next(false);
        },
        () => this.loadingStatusListener.next(false)
      )
  }

  logoutUser(clearStorage: boolean = true) {
    this.loadingStatusListener.next(true);
    this.token = null;
    this.expiry = null;
    if (clearStorage) { localStorage.removeItem('session') };
    this.user.next(null);
    this.authStatusListener.next(false);
    this.loadingStatusListener.next(false);
  }

}
