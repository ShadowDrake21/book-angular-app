import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../../../../core/services/storage.service';
import { AuthService } from '../../../../core/authentication/auth.service';
import { ChallengesService } from '../../../../core/services/challenges.service';
import { User } from '@angular/fire/auth';
import { Subject, takeUntil } from 'rxjs';
import { IChallenge } from '../../../../shared/models/challenge.model';
import { ReadingChallengeItemComponent } from '../reading-challenge-item/reading-challenge-item.component';

@Component({
  selector: 'app-reading-challenge',
  standalone: true,
  imports: [CommonModule, ReadingChallengeItemComponent],
  templateUrl: './reading-challenge.component.html',
  styleUrl: './reading-challenge.component.scss',
})
export class ReadingChallengeComponent implements OnInit, OnChanges, OnDestroy {
  private authService = inject(AuthService);
  private challengesService = inject(ChallengesService);

  @Input() isNewChallenge!: boolean;

  user!: User | null;
  destroy$: Subject<null> = new Subject();

  challenges: IChallenge[] = [];
  progressBarWidth!: string;
  progressBarTitle!: string;

  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (user: User | null) => {
        this.user = user;
        await this.updateChallenges();
      });
  }

  async updateChallenges() {
    if (!this.user?.email) return;
    this.challenges = (await this.challengesService.getAllChallenges(
      this.user?.email
    )) as IChallenge[];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isNewChallenge']) {
      this.isNewChallenge = changes['isNewChallenge'].currentValue;
      if (this.isNewChallenge) this.updateChallenges();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }
}
