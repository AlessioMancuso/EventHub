import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { MaterialModule } from '../material.module';

const routes: Routes = [
  { path: '', component: AdminPanelComponent }
];

@NgModule({
  declarations: [AdminPanelComponent],
  imports: [CommonModule, MaterialModule, RouterModule.forChild(routes)]
})
export class AdminModule {}
