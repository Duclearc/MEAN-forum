import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  imgPreview: string = '';
  imgFile: File = null;

  constructor(public route: ActivatedRoute, public authService: AuthService, private fb: FormBuilder) { }

  isLoading$ = this.authService.getLoadingStatusListener();

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onLogin() {
    if (this.loginForm.invalid) { return }
    this.authService.loginUser(this.loginForm.value);
    this.loginForm.reset();
  }
}
