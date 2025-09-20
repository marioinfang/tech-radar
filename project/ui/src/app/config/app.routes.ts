import { Routes } from '@angular/router';

import { TechRadarAdministrationPage } from '../pages/tech-radar-administration/tech-radar-administration-page/tech-radar-administration-page';
import {TechRadarPage} from '../pages/tech-radar/tech-radar-page/tech-radar-page';

export const routes: Routes = [
  { path: 'radar', component: TechRadarPage },
  { path: 'admin', component: TechRadarAdministrationPage},
];
