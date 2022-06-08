import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckComponent } from './components/check/check.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PregledComponent } from './components/pregled/pregled.component';
import { SettingsComponent } from './components/settings/settings.component';
import { StrazaPregledComponent } from './components/straza-pregled/straza-pregled.component';
import { StrazaComponent } from './components/straza/straza.component';

const routes: Routes = [
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'pregled',
    component: PregledComponent
  },
  {
    path: '',
    component: CheckComponent
  },
  {
    path: 'straza/pregled',
    component: StrazaPregledComponent
  },
  {
    path: 'straza',
    component: StrazaComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
