import { Routes } from '@angular/router';
import {Songs} from './songs/songs';

export const routes: Routes = [
  { path: "home", component: Songs },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];
