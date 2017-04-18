import { EventEmitter } from '@angular/core';
import { Pose } from './pose.model';

export class Series {
  static nextId = 0;
  static onCreate = new EventEmitter();
  type = 'series';
  id: number;
  name: string;
  poses: Pose[] = [];
  firstTransitions: Pose[] = [];
  secondTransitions: Pose[] = [];

  constructor(
    values: Object = {}
  ) {
    Object.assign(this, values);
    this.id = Series.nextId;
    Series.nextId++;
    Series.onCreate.emit();
  }

  addPose(pose, type) {
    pose.id = Pose.nextId;
    Pose.nextId++;
    if (type === 'pose') this.poses.push(pose);
    if (type === 'transition1') this.firstTransitions.push(pose);
    if (type === 'transition2') this.secondTransitions.push(pose);
  }

  deletePose(pose) {
    this.poses = this.poses.filter(node => node.id !== pose.id);
    this.firstTransitions = this.firstTransitions.filter(node => node.id !== pose.id);
    this.secondTransitions = this.secondTransitions.filter(node => node.id !== pose.id);
  }

  getPoses() {
    return this.poses;
  }

  getSequence() {
    return []
      .concat(new Pose({ name: 'left side series' }))
      .concat(this.poses)
      .concat(new Pose({ name: 'right side series' }))
      .concat(this.poses);
  }

  getPose(id) {
    let node = this.poses.find(node => node.id === id);
    if (node) return node;
    node = this.firstTransitions.find(node => node.id === id);
    if (node) return node;
    node = this.secondTransitions.find(node => node.id === id);
    if (node) return node;
  }
}