import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { TruncateTextPipe } from '../../../../shared/pipes/truncate-text.pipe';
import { IChallenge } from '../../../../shared/models/challenge.model';
import { RouterModule } from '@angular/router';
import { ChallengesService } from '../../../../core/services/challenges.service';

@Component({
  selector: 'app-reading-challenge-item',
  standalone: true,
  imports: [CommonModule, TruncateTextPipe, RouterModule],
  templateUrl: './reading-challenge-item.component.html',
  styleUrl: './reading-challenge-item.component.scss',
})
export class ReadingChallengeItemComponent implements OnInit {
  private challengesService = inject(ChallengesService);
  @Input({ required: true }) challenge!: IChallenge;
  @Input({ required: true }) email!: string | null | undefined;
  @Output() isRemovedChallenge = new EventEmitter<boolean>();

  progressBarWidth!: string;
  progressBarTitle!: string;
  subtitle: string = 'Start the challenge!';

  isEdit: boolean = false;
  oldReadCount!: number;

  ngOnInit(): void {
    console.log('challenge:', this.challenge);
    this.oldReadCount = this.challenge.read;
    this.updateProgressBar();
    this.subtitleChange();
  }

  updateProgressBar() {
    this.progressBarWidth =
      'width:' +
      Math.round((this.challenge.read / this.challenge.total) * 100) +
      '%';
    this.progressBarTitle =
      Math.round((this.challenge.read / this.challenge.total) * 100) + '%';
  }

  minusBook() {
    if (!this.isEdit) this.isEdit = true;
    this.challenge.read--;
    console.log(`You have read ${this.challenge.read}`);
    this.updateProgressBar();
    this.subtitleChange();
  }

  plusBook() {
    if (!this.isEdit) this.isEdit = true;
    this.challenge.read++;
    console.log(`You have read ${this.challenge.read}`);
    this.updateProgressBar();
    this.subtitleChange();
  }

  async updateChallenge() {
    if (this.oldReadCount === this.challenge.read || !this.email) {
      return;
    }
    this.isEdit = false;
    await this.challengesService.updateChallenge(
      this.email,
      this.challenge.id,
      this.challenge
    );
    this.oldReadCount = this.challenge.read;
  }

  subtitleChange() {
    if (this.challenge.read === this.challenge.total) {
      this.subtitle = "Congrats! You've done it!";
    } else if (
      this.challenge.read > 0 &&
      this.challenge.read < this.challenge.total
    ) {
      this.subtitle = "You're on track!";
    } else {
      this.subtitle = 'Start the challenge!';
    }
  }

  cancelEdit() {
    this.isEdit = false;
    this.challenge.read = this.oldReadCount;
    this.updateProgressBar();
    this.subtitleChange();
  }

  async removeChallenge() {
    if (!this.email) return;
    this.isRemovedChallenge.emit(false);
    await this.challengesService.deleteChallenge(this.email, this.challenge.id);
    this.isRemovedChallenge.emit(true);
  }
}
