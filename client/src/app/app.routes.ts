import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { StartComponent } from './components/start/start.component';
import { AboutComponent } from './components/about/about.component';

const route: Routes = [

  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'start',
    component: StartComponent

  },
  {
    path: 'main',
    component: MainComponent

  },
  {
    path: 'about',
    component: AboutComponent

  },
  {
    path: '**',
    redirectTo: 'start'
  },

];

export const routing = RouterModule.forRoot(route);
