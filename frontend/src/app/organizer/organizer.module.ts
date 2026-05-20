import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrganizerDashboardComponent } from './organizer-dashboard.component';
import { MaterialModule } from '../material.module';

const routes: Routes = [
  { path: '', component: OrganizerDashboardComponent }
];

@NgModule({
  declarations: [OrganizerDashboardComponent],
  imports: [CommonModule, MaterialModule, RouterModule.forChild(routes)]
})
export class OrganizerModule {}
