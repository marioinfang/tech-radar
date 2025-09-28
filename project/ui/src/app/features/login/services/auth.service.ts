import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, of, tap} from 'rxjs';
import {Router} from '@angular/router';

export enum UserRole {
  CTO = 'CTO',
  Employee = 'Employee'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private roleSubject = new BehaviorSubject<UserRole | null>(null);
  public readonly role$: Observable<UserRole | null> = this.roleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.checkInitialRole();
  }

  private checkInitialRole(): void {
    this.getCurrentUserRole().subscribe();
  }

  login(email: string, password: string) {
    return this.http.post<{ role: string }>('/api/auth/login', { email, password }).pipe(
      tap(response => {
        const role = response.role as UserRole;
        this.roleSubject.next(role);

        if (role === UserRole.CTO) {
          this.router.navigate(['/admin']);
        } else if (role === UserRole.Employee) {
          this.router.navigate(['/radar']);
        }
      })
    );
  }


  logout() {
    return this.http.post('api/auth/logout', {}, { withCredentials: true }).pipe(
      tap(() => {
        this.roleSubject.next(null);
        this.router.navigate(['/login']);
      })
    )
  }

  getCurrentUserRole() {
    return this.http.get<{ role: string }>('/api/auth/me', { withCredentials: true }).pipe(
      tap(response => {
        if (response.role === UserRole.CTO || response.role === UserRole.Employee) {
          this.roleSubject.next(response.role as UserRole);
        } else {
          this.roleSubject.next(null);
        }
      }),
      catchError(() => {
        this.roleSubject.next(null);
        return of(null); // Muss ein Observable zurückgeben
      })
    );
  }
}
