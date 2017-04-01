import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { PoseComponent } from './pose/pose.component';
import { PlayerComponent } from './player/player.component';
import { NewPoseComponent } from './new-pose/new-pose.component';
import { SequenceListComponent } from './sequence-list/sequence-list.component';

import { SequenceService } from './sequence.service';

@NgModule({
  declarations: [
    AppComponent,
    PoseComponent,
    PlayerComponent,
    NewPoseComponent,
    SequenceListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [SequenceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
