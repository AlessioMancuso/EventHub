import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { JwtInterceptor } from './jwt.interceptor';
import { HomeComponent } from './home.component';
import { EventDetailComponent } from './event-detail.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

@NgModule({
  declarations: [AppComponent, HomeComponent, EventDetailComponent, LoginComponent, RegisterComponent],
  imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, FormsModule, ReactiveFormsModule, AppRoutingModule, MaterialModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthGuard,
    RoleGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
