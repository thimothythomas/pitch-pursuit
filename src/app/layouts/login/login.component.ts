import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // if access token is there, redirect to home
    console.log(this.authService.accessToken);
    if (this.authService.accessToken) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // Implement your login logic here
      console.log('Login successful!', this.loginForm.value);
      let isLoginValid = this.authService.loginUsers(this.loginForm.value.email, this.loginForm.value.password);
      console.log(isLoginValid);
      if (isLoginValid) {
        // Implement your login logic here
        console.log('Login successful!', this.loginForm.value);
        this.authService.setAccessToken(isLoginValid);
        
        if (isLoginValid.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        // Mark form controls as touched to display validation errors
        alert('Invalid credentials');
        this.loginForm.markAllAsTouched();
      }
    } else {
      // Mark form controls as touched to display validation errors
      this.loginForm.markAllAsTouched();
    }
  }
}
