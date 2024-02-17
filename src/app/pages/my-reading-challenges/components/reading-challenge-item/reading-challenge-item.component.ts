import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';
import { IChallenge } from '../../../../shared/models/challenge.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reading-challenge-item',
  standalone: true,
  imports: [CommonModule, TruncateTextPipe, RouterModule],
  templateUrl: './reading-challenge-item.component.html',
  styleUrl: './reading-challenge-item.component.scss',
})
export class ReadingChallengeItemComponent implements OnInit, OnChanges {
  @Input({ required: true }) challenge!: IChallenge;
  progressBarWidth!: string;
  progressBarTitle!: string;

  ngOnInit(): void {
    console.log('challenge:', this.challenge);
    this.progressBarWidth =
      'width:' +
      Math.round((this.challenge.read / this.challenge.total) * 100) +
      '%';
    this.progressBarTitle =
      Math.round((this.challenge.read / this.challenge.total) * 100) + '%';
  }
  ngOnChanges(changes: SimpleChanges): void {}
}
