import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';




import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './components/signin/signin.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CheckComponent } from './components/check/check.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OgrodjeComponent } from './components/ogrodje/ogrodje.component';
import { HttpClient, HttpClientModule } from "@angular/common/http";


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SettingsComponent,
    CheckComponent,
    NotFoundComponent,
    OgrodjeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatSliderModule,
    MatButtonModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
