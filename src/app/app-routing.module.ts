import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckComponent } from './components/check/check.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { OsebnoNapredovanjeCheckComponent } from './components/osebno-napredovanje-check/osebno-napredovanje-check.component';
import { OsebnoNapredovanjePregledComponent } from './components/osebno-napredovanje-pregled/osebno-napredovanje-pregled.component';
import { PregledComponent } from './components/pregled/pregled.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SigninComponent } from './components/signin/signin.component';

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
    path: 'osebno-napredovanje',
    component: OsebnoNapredovanjeCheckComponent,
  },
  {
    path: 'osebno-napredovanje/pregled',
    component: OsebnoNapredovanjePregledComponent
  },
  {
    path: '',
    component: CheckComponent
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
