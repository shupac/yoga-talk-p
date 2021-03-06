import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pose } from '../../_data/pose.model';
import { Settings } from '../../settings';

@Component({
  selector: 'app-pose-detail',
  templateUrl: './pose-detail.component.html',
  styleUrls: [
    './pose-detail.component.css',
    '../shared.style.css'
  ]
})
export class PoseDetailComponent {
  @Input() private target: Pose;
  @Input() private seriesPose: boolean = false;
  @Output() private addPose: EventEmitter<Pose> = new EventEmitter();
  @Output() private deletePose: EventEmitter<Pose> = new EventEmitter();
  @Output() private save: EventEmitter<any> = new EventEmitter();

  pose: Pose = new Pose();

  ngDoCheck() {
    if (this.target) {
      this.pose = this.target;
      this.seriesPose = this.target.seriesPose;
    }

    if (this.seriesPose) {
      this.pose.repeat = 'both';
      this.pose.seriesPose = true;
    }
    else this.pose.seriesPose = false;

    if (this.pose.timing === 'rounds') this.pose.repeat = 'once';
  }

  getModel() {
    return this.pose;
  }

  createNewModel() {
    this.pose = new Pose();
  }

  setDefault(setting) {
    if (setting === 'speed')
      Settings.defaultSpeed = this.pose.speed;
    if (setting === 'duration')
      Settings.defaultDuration = this.pose.duration;
    alert(`default ${setting} set to ${this.pose[setting]}`);
  }
}
