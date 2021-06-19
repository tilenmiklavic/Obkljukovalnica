import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './components/signin/signin.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CheckComponent } from './components/check/check.component';

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SettingsComponent,
    CheckComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
