import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { EventDetailComponent } from './event-detail.component';
import { MyRegistrationsComponent } from './my-registrations.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'events/:id', component: EventDetailComponent },
  { path: 'my/registrations', component: MyRegistrationsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
