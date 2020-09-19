import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  //catches http requests and...
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    if(!token) {
      //if there's no token, just proceed with the request
      return next.handle(req);
    }
    //adds an Authorization header to the request containing the token
    const authRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token)
    });

    //then passes the new request (containing the Auth header) along
    return next.handle(authRequest);
  }
}
