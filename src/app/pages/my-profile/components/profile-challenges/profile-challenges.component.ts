import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IChallenge } from '../../../../shared/models/challenge.model';

@Component({
  selector: 'app-profile-challenges',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-challenges.component.html',
  styleUrl: './profile-challenges.component.scss',
})
export class ProfileChallengesComponent implements OnChanges {
  @Input({ required: true }) challenge!: IChallenge;
  progressBarWidth!: string;
  progressBarTitle!: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['challenge']) {
      this.challenge = changes['challenge'].currentValue;
      this.progressBarWidth =
        'width:' +
        Math.round((this.challenge.read / this.challenge.total) * 100) +
        '%';
      this.progressBarTitle =
        Math.round((this.challenge.read / this.challenge.total) * 100) + '%';
    }
  }
}
