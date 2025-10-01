import { TestBed } from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService, UserRole } from './auth.service';
import {provideHttpClient} from '@angular/common/http';

// Mock router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: MockRouter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useClass: MockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as unknown as MockRouter;

    const req = httpMock.expectOne('/api/auth/me');
    req.flush({});
  });

  afterEach(() => {
    httpMock.verify();
    router.navigate.calls.reset();
  });

  it('should set role to CTO when CTO is logged in', () => {
    let currentRole: any = null;
    service.role$.subscribe(role => currentRole = role);

    const subscription = service.getCurrentUserRole().subscribe();

    const req = httpMock.expectOne('/api/auth/me');
    expect(req.request.method).toBe('GET');

    req.flush({role: 'CTO'});
    expect(currentRole).toBe(UserRole.CTO);
    subscription.unsubscribe();
  });

  it('should set role to null when no one is logged in or fails', () => {
    let currentRole: any = UserRole.CTO;

    service.role$.subscribe(role => currentRole = role);

    const subscription = service.getCurrentUserRole().subscribe();
    const req = httpMock.expectOne('/api/auth/me');

    req.flush('Simulated 401 error', {
      status: 401,
      statusText: 'Unauthorized'
    });

    expect(currentRole).toBe(null);
    subscription.unsubscribe();
  });

  it('CTO should log in and navigate to admin', () => {
    let currentRole: any = null;
    service.role$.subscribe(role => currentRole = role);

    service.login('cto@example.com', 'password').subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'cto@example.com', password: 'password' });

    req.flush({ role: 'CTO' });

    expect(currentRole).toBe(UserRole.CTO);
    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('Employee should log in and navigate to radar', () => {
    let currentRole: any = null;
    service.role$.subscribe(role => currentRole = role);

    service.login('employee@example.com', 'password').subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'employee@example.com', password: 'password' });

    req.flush({ role: 'Employee' });

    expect(currentRole).toBe(UserRole.Employee);
    expect(router.navigate).toHaveBeenCalledWith(['/radar']);
  });

  it('should not navigate on login failure', () => {
    let currentRole: UserRole | null = null;
    service.role$.subscribe(role => currentRole = role);

    service.login('fail@example.com', 'password').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/auth/login');

    req.flush('Simulated 401 error', {
      status: 401,
      statusText: 'Unauthorized'
    });

    expect(currentRole).toBe(null);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should log out and navigate to login', () => {
    (service as any).roleSubject.next(UserRole.CTO);
    let currentRole: any = UserRole.CTO;
    service.role$.subscribe(role => currentRole = role);

    service.logout().subscribe();

    const req = httpMock.expectOne('api/auth/logout');
    expect(req.request.method).toBe('POST');

    req.flush({});

    expect(currentRole).toBe(null);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
