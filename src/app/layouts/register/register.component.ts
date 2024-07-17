import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  get formControls() {
    return this.registerForm.controls;
  }

  onSubmit() {
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      // Implement your registration logic here
      console.log('Registration successful!', this.registerForm.value);
      this.authService.registerUsers(this.registerForm.value);
      this.autoLogin();
    } else {
      // Mark form controls as touched to display validation errors
      this.registerForm.markAllAsTouched();
    }
  }

  autoLogin() {
    let isLoginValid = this.authService.loginUsers(this.registerForm.value.email, this.registerForm.value.password);
    console.log(isLoginValid);
    if (isLoginValid) {
      // Implement your login logic here
      console.log('Login successful!', this.registerForm.value);
      this.authService.setAccessToken(isLoginValid);
      // redirect to home
      this.router.navigate(['/']);
    } else {
      // Mark form controls as touched to display validation errors
      alert('Invalid credentials');
    }
  }
}
