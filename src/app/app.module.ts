import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import { HeaderComponent } from './header/header.component';
import { SignupComponent } from './auth/signup/signup.component';
import {LoginComponent} from "./auth/login/login.component";
import {AuthInterceptor} from "./auth/auth-interceptor";
import {errorInterceptor} from "./error-interceptor";
import {ErrorComponent} from "./error/error.component";
import {AngularMaterialModule} from "./angular-material.module";
import {PostsModule} from "./posts/posts.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    PostsModule,
    BrowserAnimationsModule,
    AngularMaterialModule
  ],
  entryComponents: [
    ErrorComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: errorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
