import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoCreationComponent } from './video-creation/video-creation.component';
import { VideoIdeasComponent } from './video-ideas/video-ideas.component';
import { VideoListComponent } from './video-list/video-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/create', pathMatch: 'full' },
  { path: 'list', component: VideoListComponent },
  { path: 'create', component: VideoCreationComponent },
  { path: 'ideas', component: VideoIdeasComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
