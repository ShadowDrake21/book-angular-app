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
import { PaginationLiteService } from '../../../../core/services/pagination-lite.service';
import { ReadingChallengeFinishedComponent } from '../reading-challenge-finished/reading-challenge-finished.component';

@Component({
  selector: 'app-reading-challenge',
  standalone: true,
  imports: [
    CommonModule,
    ReadingChallengeItemComponent,
    ReadingChallengeFinishedComponent,
  ],
  providers: [PaginationLiteService],
  templateUrl: './reading-challenge.component.html',
  styleUrl: './reading-challenge.component.scss',
})
export class ReadingChallengeComponent implements OnInit, OnChanges, OnDestroy {
  private authService = inject(AuthService);
  private challengesService = inject(ChallengesService);
  protected paginationLiteService = inject(PaginationLiteService);

  @Input() isNewChallenge!: boolean;

  user!: User | null;
  destroy$: Subject<null> = new Subject();

  itemsPerPage: number = 5;
  currentActivePage: number = 1;
  currentFinishedPage: number = 1;
  visibleActiveChallenges: IChallenge[] = [];
  visibleFinishedChallenges: IChallenge[] = [];

  loadingActiveChallenges!: boolean;
  activeChallenges: IChallenge[] = [];

  loadingFinishedChallenges!: boolean;
  finishedChallenges: IChallenge[] = [];

  ngOnInit(): void {
    this.loadingActiveChallenges = true;
    this.loadingFinishedChallenges = true;
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (user: User | null) => {
        this.user = user;
        await this.getActiveChallenges().then(() => {
          this.updateVisibleChallenges('active');
          this.loadingActiveChallenges = false;
        });
        await this.getFinishedChallenges().then(() => {
          this.updateVisibleChallenges('finished');
          this.loadingFinishedChallenges = false;
        });
      });
  }

  async getActiveChallenges() {
    if (!this.user?.email) return;
    this.activeChallenges = (await this.challengesService.getAllChallenges(
      this.user?.email,
      'activeChallenges'
    )) as IChallenge[];
    this.updateVisibleChallenges('active');
  }

  async getFinishedChallenges() {
    if (!this.user?.email) return;
    this.finishedChallenges = (await this.challengesService.getAllChallenges(
      this.user?.email,
      'finishedChallenges'
    )) as IChallenge[];
    this.updateVisibleChallenges('finished');
  }

  async removeChallenge(
    challengeId: string,
    entity: string = 'activeChallenges'
  ) {
    if (!this.user?.email) return;
    await this.challengesService.deleteChallenge(
      this.user?.email,
      entity,
      challengeId
    );
    if (entity === 'activeChallenges') {
      await this.getActiveChallenges();
    } else {
      await this.getFinishedChallenges();
    }
  }

  async updateChallenge(challenge: IChallenge) {
    if (!this.user?.email) return;
    if (challenge.total === challenge.read) {
      await this.challengesService.addNewChallenge(
        this.user?.email,
        'finishedChallenges',
        challenge
      );
      await this.challengesService.deleteChallenge(
        this.user?.email,
        'activeChallenges',
        challenge.id
      );
      await this.getFinishedChallenges();
      await this.getActiveChallenges();
    } else {
      await this.challengesService.updateChallenge(
        this.user?.email,
        challenge.id,
        challenge
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isNewChallenge']) {
      this.isNewChallenge = changes['isNewChallenge'].currentValue;
      if (this.isNewChallenge) this.getActiveChallenges();
    }
  }

  updateVisibleChallenges(type: 'active' | 'finished') {
    if (type === 'active') {
      const startIndex = (this.currentActivePage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.visibleActiveChallenges = this.activeChallenges.slice(
        startIndex,
        endIndex
      );
    } else {
      const startIndex = (this.currentFinishedPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.visibleFinishedChallenges = this.finishedChallenges.slice(
        startIndex,
        endIndex
      );
    }
  }

  nextPage(type: 'active' | 'finished') {
    if (type === 'active') {
      if (this.currentActivePage < this.numPages(type)) {
        this.currentActivePage++;
        this.updateVisibleChallenges(type);
      }
    } else {
      if (this.currentFinishedPage < this.numPages(type)) {
        this.currentFinishedPage++;
        this.updateVisibleChallenges(type);
      }
    }
  }

  prevPage(type: 'active' | 'finished') {
    if (type === 'active') {
      if (this.currentActivePage > 1) {
        this.currentActivePage--;
        this.updateVisibleChallenges(type);
      }
    } else {
      if (this.currentFinishedPage > 1) {
        this.currentFinishedPage--;
        this.updateVisibleChallenges(type);
      }
    }
  }

  numPages(type: 'active' | 'finished'): number {
    if (type === 'active') {
      return Math.ceil(this.activeChallenges.length / this.itemsPerPage);
    } else {
      return Math.ceil(this.finishedChallenges.length / this.itemsPerPage);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }
}
