import { Component } from '@angular/core';
import {MatToolbar} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatListItem, MatNavList} from '@angular/material/list';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [
    MatToolbar,
    MatIcon,
    MatIconButton,
    MatSidenavContainer,
    MatSidenavContent,
    MatListItem,
    RouterLink,
    RouterLinkActive,
    MatNavList,
    MatSidenav
  ],
  template: `
    <mat-sidenav-container>
      <mat-sidenav #sidenav [opened]="isNavOpen" mode="side">
        <mat-nav-list>
          <a mat-list-item routerLink="/radar" routerLinkActive="active">
            <span matListItemTitle>Technology Radar</span>
          </a>
          <a mat-list-item routerLink="/admin" routerLinkActive="active">
            <span matListItemTitle>Administration</span>
          </a>
          <a mat-list-item routerLink="/login" routerLinkActive="active">
            <span matListItemTitle>Login</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button mat-icon-button (click)="toggleSidenav()">
            <mat-icon>menu</mat-icon>
          </button>
          <!-- TODO: Titel anpassen -->
          <span>Technology Radar</span>
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
  isNavOpen: boolean = false;

  toggleSidenav(): void {
    this.isNavOpen = !this.isNavOpen;
  }
}
