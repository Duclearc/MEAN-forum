import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  isLoading$: Observable<boolean>;
  imgPreview: string = '';
  imgFile: File = null;

  constructor(public route: ActivatedRoute, public authService: AuthService, private fb: FormBuilder) {
    this.isLoading$ = authService.getLoadingStatusListener();
  }

  registerForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  })

  onImgPick(event: Event) {
    this.imgFile = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => this.imgPreview = reader.result as string;
    reader.readAsDataURL(this.imgFile);
  }

  onRegister() {
    if (this.registerForm.invalid) { return };
    this.authService.createUser(this.registerForm.value, this.imgFile);
    this.registerForm.reset();
  }
}
