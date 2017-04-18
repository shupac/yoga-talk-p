import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Sequence } from '../_data/sequence.model';
import { SequenceService } from '../_data/sequence.service';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-sequences-list',
  templateUrl: './sequences-list.component.html',
  styleUrls: ['./sequences-list.component.css']
})
export class SequencesListComponent {

    paramsSub;
    // sequences: Sequence[];

    constructor(
      private service: SequenceService,
      private router: Router,
      private route: ActivatedRoute
    ) {}

    ngOnInit() {
      // this.service.getSequences().then(sequences => this.sequences = sequences);
      this.paramsSub = this.route.params.subscribe(params => {
        console.log(params);
      });
    }

    ngOnDestroy () {
      this.paramsSub.unsubscribe();
    }

    get sequences() {
      console.log('get sequences');
      return this.service.sequences;
    }

    addSequence() {
      this.service.addSequence();
    }

    selectSequence(sequence) {
      this.service.currentSequence = sequence;
    }
  }