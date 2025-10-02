import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatError, MatInput, MatLabel} from '@angular/material/input';
import {MatFormField} from '@angular/material/form-field';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login-form',
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title data-testid="login-card-title">Login</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="loginForm" (ngSubmit)="handleLogin()">
          @if (errorMessage) {
            <p style="color: red; margin-top: 10px;">{{ errorMessage }}</p>
          }
          <mat-form-field class="example-full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="username" type="email">
            @if (loginForm.get('username')?.errors?.['email']) {
              <mat-error>Invalid Email</mat-error>
            }
          </mat-form-field>
          <mat-form-field>
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password">
            @if (loginForm.get('password')?.errors?.['pattern']) {
              <mat-error>Min. 8 Characters, 1 uppercase, 1 lowercase, 1 number</mat-error>
            }
          </mat-form-field>
          <button mat-raised-button type="submit" [disabled]="!loginForm.valid">Login</button>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    mat-form-field {
      width: 100%;
    }
    mat-card-header {
      justify-content: center;
      padding: 30px;
    }
    button {
      margin-top: 20px;
      justify-content: center;
    }
  `,
  standalone: true,
})
export class LoginForm {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);

  errorMessage: string | null = null;

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  handleLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage = null;

    this.authService.login(this.loginForm.value.username!, this.loginForm.value.password!).subscribe({
      next: () => {
      },
      error: (err) => {
        this.errorMessage = 'There was en error while logging in. Please try again.';
        console.error('Login error:', err);
      }
    });
  }
}
