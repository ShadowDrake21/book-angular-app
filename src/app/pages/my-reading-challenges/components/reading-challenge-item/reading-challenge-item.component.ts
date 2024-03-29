import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
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
  @Input() email!: string | null | undefined;
  @Input() isFinished: boolean = false;
  @Output() challengeOnRemove = new EventEmitter<string>();
  @Output() challengeOnUpdate = new EventEmitter<IChallenge>();
  @Output() challengeWhileUpdate = new EventEmitter<boolean>();

  progressBarWidth!: string;
  progressBarTitle!: string;
  subtitle: string = 'Start the challenge!';

  isEdit: boolean = false;
  oldReadCount!: number;

  ngOnInit(): void {
    this.oldReadCount = this.challenge.read;
    this.updateProgressBar();
    this.subtitleChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
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
    if (!this.isEdit) {
      this.setBoolValuesWhileEditing(true);
    }
    this.challenge.read--;
    this.updateProgressBar();
    this.subtitleChange();
  }

  plusBook() {
    if (!this.isEdit) {
      this.setBoolValuesWhileEditing(true);
    }
    this.challenge.read++;
    this.updateProgressBar();
    this.subtitleChange();
  }

  updateChallenge() {
    if (this.oldReadCount === this.challenge.read) {
      this.cancelEdit();
    }
    this.setBoolValuesWhileEditing(false);
    this.challengeOnUpdate.emit(this.challenge);
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
    this.setBoolValuesWhileEditing(false);
    this.challenge.read = this.oldReadCount;
    this.updateProgressBar();
    this.subtitleChange();
  }

  setBoolValuesWhileEditing(value: boolean) {
    this.isEdit = value;
    this.challengeWhileUpdate.emit(this.isEdit);
  }
}
