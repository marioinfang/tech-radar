import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginForm } from './login-form';
import {AuthService} from '../../services/auth.service';
import {of, throwError} from 'rxjs';
import {By} from '@angular/platform-browser';

// Mock auth service
class MockAuthService {
  login = jasmine.createSpy('login').and.returnValue(of(true)); // default = success
}

describe('LoginForm', () => {
  let component: LoginForm;
  let fixture: ComponentFixture<LoginForm>;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginForm,
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginForm);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message on login failure', () => {
    const mockError = { status: 401 };
    mockAuthService.login.and.returnValue(throwError(() => mockError));

    component.loginForm.setValue({
      username: 'test@test.com',
      password: 'password123'
    });
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    submitButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.errorMessage).not.toBeNull();

    const errorElement = fixture.debugElement.query(By.css('p[style*="color: red"]'));
    expect(errorElement).not.toBeNull();
    expect(errorElement.nativeElement.textContent).toContain('There was en error while logging in.');
  });
});
