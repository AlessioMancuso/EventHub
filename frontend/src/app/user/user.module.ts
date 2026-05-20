import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MyRegistrationsComponent } from '../my-registrations.component';
import { ProfileComponent } from '../profile.component';
import { MaterialModule } from '../material.module';

const routes: Routes = [
  { path: 'registrations', component: MyRegistrationsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: 'registrations', pathMatch: 'full' }
];

@NgModule({
  declarations: [MyRegistrationsComponent, ProfileComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, RouterModule.forChild(routes)]
})
export class UserModule {}
