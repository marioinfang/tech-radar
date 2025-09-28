import {Component, inject} from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {NavigationEnd, Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService, UserRole} from '../../features/login/services/auth.service';
import {AsyncPipe} from '@angular/common';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {filter, startWith} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  imports: [
    MatSidenavContainer,
    MatSidenavContent,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    MatNavList,
    MatSidenav,
    AsyncPipe,
    MatToolbar,
    MatIcon,
    MatIconButton
  ],
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav [opened]="isNavOpen" mode="side">
        <mat-nav-list>
          @if (role$ | async; as role) {
            <a mat-list-item routerLink="/radar" routerLinkActive="active">
              <span matListItemTitle>Technology Radar</span>
            </a>

            @if (role === UserRole.CTO) {
              <a mat-list-item routerLink="/admin" routerLinkActive="active">
                <span matListItemTitle>Administration</span>
              </a>
            }

            <a mat-list-item (click)="logout()">
              <span matListItemTitle>Logout</span>
            </a>
          } @else {
            <a mat-list-item routerLink="/login" routerLinkActive="active">
              <span matListItemTitle>Login</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>menu</mat-icon>
          </button>
          <span>{{ title$ | async }}</span>
        </mat-toolbar>

        <div class="content">
          <ng-content></ng-content>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    mat-sidenav-container {
      height: 100vh;
    }

    mat-sidenav {
      width: 250px;
      background-color: #f5f5f5;
    }

    .content {
      padding: 20px;
    }

    mat-toolbar {
      display: flex;
      gap: 16px;
    }

    mat-nav-list {
      padding-top: 16px;
    }

    a[mat-list-item] {
      margin: 8px 0;
    }

    mat-icon {
      margin-right: 8px;
    }
  `
})
export class Navigation {
  private authService = inject(AuthService);
  private router = inject(Router);
  protected readonly UserRole = UserRole;
  private titles: Record<string, string> = {
    '/radar': 'Technology Radar',
    '/admin': 'Administration',
    '/login': 'Login'
  };

  role$ = this.authService.role$;
  isNavOpen: boolean = false;



  title$ = this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    map((e: any) => this.titles[e.urlAfterRedirects] || 'App'),
    startWith('App')
  );

  toggleSidenav(): void {
    this.isNavOpen = !this.isNavOpen;
  }

  logout() {
   this.authService.logout().subscribe();
  }
}
