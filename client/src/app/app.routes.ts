import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { StartComponent } from './components/start/start.component';

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
  // {
  //   path: 'problems/:id',
  //   component: ProblemDetailComponent,
  //   canActivate: ['auth-guard']

  // },
  // {
  //   path: 'myprofile',
  //   component: MyProfileComponent,
  //   canActivate: ['auth-guard']

  // },
  {
    path: '**',
    redirectTo: 'start'
  },

];

export const routing = RouterModule.forRoot(route);
