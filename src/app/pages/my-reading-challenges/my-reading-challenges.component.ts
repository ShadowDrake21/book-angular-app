import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReadingChallengeComponent } from './components/reading-challenge/reading-challenge.component';
import { AddReadingChallengeComponent } from './components/add-reading-challenge/add-reading-challenge.component';

@Component({
  selector: 'app-my-reading-challenges',
  standalone: true,
  imports: [
    CommonModule,
    AddReadingChallengeComponent,
    ReadingChallengeComponent,
  ],
  templateUrl: './my-reading-challenges.component.html',
  styleUrl: './my-reading-challenges.component.scss',
})
export class MyReadingChallengesComponent {
  isNewChallenge!: boolean;

  getIsNewChallenge(value: boolean) {
    this.isNewChallenge = value;
  }
}
