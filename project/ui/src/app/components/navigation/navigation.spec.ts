import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Navigation } from './navigation';
import {BehaviorSubject, of} from 'rxjs';
import {AuthService, UserRole} from '../../features/login/services/auth.service';
import {By} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';

// Mock for auth servicepin
class MockAuthService {
  private roleSubject = new BehaviorSubject<UserRole | null>(null);

  role$ = this.roleSubject.asObservable();

  setRole(role: UserRole | null) {
    this.roleSubject.next(role);
  }

  logout() {
    return of(null);
  }
}

describe('Navigation', () => {
  let component: Navigation;
  let fixture: ComponentFixture<Navigation>;
  let mockAuthService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Navigation
      ],
      providers: [
        provideRouter([
          { path: 'login', component: Navigation},
          { path: 'admin', component: Navigation},
          { path: 'radar', component: Navigation},

        ]),
        { provide: AuthService, useClass: MockAuthService }
      ]
    })
    .compileComponents();

    mockAuthService = TestBed.inject(AuthService) as unknown as MockAuthService;

    fixture = TestBed.createComponent(Navigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should toggle the sidenav state when toggleSidenav is called', () => {
    expect(component.isNavOpen).toBeFalse();
    component.toggleSidenav();
    expect(component.isNavOpen).toBeTrue();
  });

  it('should only show the login link when role is null', () => {
    mockAuthService.setRole(null);
    fixture.detectChanges();

    // check if the login link is visible
    const loginLink = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
    expect(loginLink).not.toBeNull();
    expect(loginLink.nativeElement.textContent).toContain('Login');

    const allLinks = fixture.debugElement.queryAll(By.css('a[mat-list-item]'));
    expect(allLinks.length).toBe(1);
  });

  it('should show Radar and Logout links for Employee, but not Admin', async () => {
    mockAuthService.setRole(UserRole.Employee);
    fixture.detectChanges();

    await fixture.whenStable();
    fixture.detectChanges();

    // check visibility of radar
    expect(fixture.debugElement.query(By.css('a[routerLink="/radar"]'))).not.toBeNull();

    // check logout link
    const allLinks = fixture.debugElement.queryAll(By.css('a[mat-list-item]'));
    const logoutLink = allLinks.find(link => link.nativeElement.textContent.trim().includes('Logout'));
    expect(logoutLink).not.toBeUndefined();

    // check that the admin link is not visible
    expect(fixture.debugElement.query(By.css('a[routerLink="/admin"]'))).toBeNull();
  });

  it('should show Radar, Admin, and Logout links for CTO', () => {
    mockAuthService.setRole(UserRole.CTO);
    fixture.detectChanges();

    // Check if all links are visible
    expect(fixture.debugElement.query(By.css('a[routerLink="/radar"]'))).not.toBeNull();
    expect(fixture.debugElement.query(By.css('a[routerLink="/admin"]'))).not.toBeNull();

    // check logout link
    const allLinks = fixture.debugElement.queryAll(By.css('a[mat-list-item]'));
    const logoutLink = allLinks.find(link => link.nativeElement.textContent.trim().includes('Logout'));
    expect(logoutLink).not.toBeUndefined();
  });

  it('should call authService.logout() when the Logout button is clicked', () => {
    mockAuthService.setRole(UserRole.CTO);
    fixture.detectChanges();

    const logoutSpy = spyOn(mockAuthService, 'logout').and.callThrough();
    const allLinks = fixture.debugElement.queryAll(By.css('a[mat-list-item]'));
    const logoutLink = allLinks.find(link => link.nativeElement.textContent.trim().includes('Logout'));

    expect(logoutLink).not.toBeUndefined();

    // simulate click
    if (logoutLink) {
      logoutLink.triggerEventHandler('click', null);
    }

    expect(logoutSpy).toHaveBeenCalled();
  });
});
