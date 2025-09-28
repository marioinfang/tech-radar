import { Routes } from '@angular/router';

import { TechRadarAdministrationPage } from '../pages/tech-radar-administration/tech-radar-administration-page/tech-radar-administration-page';
import {TechRadarPage} from '../pages/tech-radar/tech-radar-page/tech-radar-page';
import {LoginPage} from '../pages/login-page/login-page';
import {roleGuard} from './role.guard';
import {UserRole} from '../features/login/services/auth.service';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'radar', component: TechRadarPage, canActivate: [roleGuard], data: { roles: [UserRole.CTO, UserRole.Employee]}},
  { path: 'admin', component: TechRadarAdministrationPage, canActivate: [roleGuard], data: { roles: [UserRole.CTO] }},
  { path: '**', redirectTo: 'login' }
];
