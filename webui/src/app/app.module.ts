import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { VideoCreationComponent } from './video-creation/video-creation.component';
import { VideoIdeasComponent } from './video-ideas/video-ideas.component';
import { VideoListComponent } from './video-list/video-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    VideoCreationComponent,
    VideoIdeasComponent,
    VideoListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
