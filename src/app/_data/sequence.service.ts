import { NgZone } from '@angular/core';
import { Injectable } from '@angular/core';

import { ModelsService } from './models.service';

import { Sequence } from './sequence.model';
import { Series } from './series.model';
import { Pose } from './pose.model';
import { Settings } from '../settings';
import STUB_SEQUENCE from '../stub-sequence';

@Injectable()
export class SequenceService {
  zone: NgZone;
  fbRef: any;
  sequences: any[] = [];
  currentEditNode: any;
  currentSequence: Sequence;
  currentSpeechIndex: number = null;
  sortRoot: string;

  constructor(
    private modelsService: ModelsService
  ) {
    // this.stubPoses();
    this.zone = new NgZone({enableLongStackTrace: false});
  }

  getSequences(): Promise<Sequence[]> {
    return new Promise((resolve, reject) => {
      this.fbRef.once('value')
      .then(snapshot => {
        let sequences = snapshot.val();
        if (sequences) this.sequences = sequences;
        resolve(this.sequences);
      })
      .catch(err => reject(err));
    });
  }

  get currentPoseId() {
    if (this.currentSpeechIndex === null) return null;
    return this.currentSequence.speechSequence[this.currentSpeechIndex].id;
  }

  get speechSequence() {
    return this.currentSequence.speechSequence;
  }

  setCurrentSequence(id) {
    this.zone.run(() => {
      this.currentSequence = this.sequences.find(sequence => sequence.id === id);
    });
  }

  addSequence() {
    let sequence = new Sequence();
    sequence.id = Sequence.nextId;
    sequence.name += sequence.id;
    Sequence.nextId++;
    this.modelsService.updateSequenceIndex();
    this.fbRef.child(sequence.id + '').set(sequence).then(() => {
      this.zone.run(() => {
        this.sequences.push(sequence);
      });
    });
  }

  addToSequence(node, sequence) {
    if (node.type === 'pose') {
      node.id = Pose.nextId;
      Pose.nextId++;
      this.modelsService.updatePoseIndex();
    }
    if (node.type === 'series') {
      node.id = Series.nextId;
      Series.nextId++;
      this.modelsService.updateSeriesIndex();
    }
    if (!sequence.nodes) sequence.nodes = [];
    sequence.nodes.push(node);
    this.saveCurrentSequence();
    return node;
  }

  addToSeries(pose, series, type) {
    pose.id = Pose.nextId;
    Pose.nextId++;
    this.modelsService.updatePoseIndex();
    if (type === 'pose') series.poses.push(pose);
    if (type === 'transition1') series.firstTransitions.push(pose);
    if (type === 'transition2') series.secondTransitions.push(pose);
    this.saveCurrentSequence();
  }

  deleteSequence(id) {
    this.sequences = this.sequences.filter(s => s.id !== id);
    this.fbRef.set(this.sequences);
  }

  deleteSeries(id) {
    this.currentSequence.nodes = this.currentSequence.nodes.filter(node => {
      if (node.type === 'pose') return true;
      if (node.type === 'series' && node.id !== id) return true;
      return false;
    });
    this.saveCurrentSequence();
  }

  deletePose(id) {
    this.currentSequence.nodes = this.currentSequence.nodes.filter(node => {
      if (node.type === 'pose' && node.id !== id) return true;
      if (node.type === 'series') {
        if (node.poses) node.poses = node.poses.filter(node => node.id !== id);
        if (node.firstTransitions) node.firstTransitions = node.firstTransitions.filter(node => node.id !== id);
        if (node.secondTransitions) node.secondTransitions = node.secondTransitions.filter(node => node.id !== id);
        return true;
      }
    });
    this.saveCurrentSequence();
  }

  saveCurrentSequence() {
    this.fbRef.child(this.currentSequence.id).set(this.currentSequence);
  }

  toggleSort(type) {
    if (this.sortRoot === type) this.sortRoot = null;
    else this.sortRoot = type;
  }
  // private stubPoses() {
  //   let sequence = new Sequence();
  //   this.currentSequence = sequence;
  //   // this.addSequence(sequence);

  //   let SERIES = {};
  //   STUB_SEQUENCE.forEach(node => {
  //     if (node.type === 'pose') {
  //       let pose = new Pose({
  //         name: node.name,
  //         sides: node['sides']
  //       });
  //       if (node['unilateralOnly']) pose.unilateralOnly = node['unilateralOnly'];
  //       if (node['timing']) pose.timing = node['timing'];
  //       if (node['duration']) pose.duration = node['duration'];

  //       if (node.parent.type === 'sequence')
  //         this.currentSequence.addPose(pose);
  //       if (node.parent.type === 'series') {
  //         SERIES[node.parent['id']].addPose(pose, node['pose'] || 'pose');
  //       }
  //     }

  //     if (node.type === 'series') {
  //       let series = new Series({ name: node.name });
  //       this.currentSequence.addSeries(series);
  //       SERIES[series.id] = series;
  //     }
  //   });
  // }
}
