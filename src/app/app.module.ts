import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatBadgeModule} from '@angular/material/badge';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './components/signin/signin.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CheckComponent } from './components/check/check.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OgrodjeComponent } from './components/ogrodje/ogrodje.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { PregledComponent } from './components/pregled/pregled.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ChartModule } from 'angular2-chartjs';
import { OsebnoNapredovanjeCheckComponent } from './components/osebno-napredovanje-check/osebno-napredovanje-check.component';
import { OsebnoNapredovanjePregledComponent } from './components/osebno-napredovanje-pregled/osebno-napredovanje-pregled.component';


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SettingsComponent,
    CheckComponent,
    NotFoundComponent,
    OgrodjeComponent,
    PregledComponent,
    OsebnoNapredovanjeCheckComponent,
    OsebnoNapredovanjePregledComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatTooltipModule,
    MatSliderModule,
    MatButtonModule,
    HttpClientModule,
    MatInputModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDividerModule,
    MatBadgeModule,
    MatSlideToggleModule,
    ChartModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
