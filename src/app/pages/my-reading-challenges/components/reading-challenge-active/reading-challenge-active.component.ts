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
import { ReadingChallengeItemComponent } from '../reading-challenge-item/reading-challenge-item.component';
import { ChallengesService } from '../../../../core/services/challenges.service';
import { PaginationLiteService } from '../../../../core/services/pagination-lite.service';
import { IChallenge } from '../../../../shared/models/challenge.model';

@Component({
  selector: 'app-reading-challenge-active',
  standalone: true,
  imports: [CommonModule, ReadingChallengeItemComponent],
  templateUrl: './reading-challenge-active.component.html',
  styleUrl: './reading-challenge-active.component.scss',
})
export class ReadingChallengeActiveComponent implements OnInit, OnChanges {
  private challengesService = inject(ChallengesService);
  protected paginationLiteService = inject(PaginationLiteService);

  @Input() email!: string | null | undefined;
  @Input() isNewChallenge!: boolean;
  @Output() isFinishedReload = new EventEmitter<boolean>();

  loadingActiveChallenges!: boolean;
  activeChallenges: IChallenge[] = [];
  challengeWhileEditing: boolean = false;

  async ngOnInit(): Promise<void> {
    this.loadingActiveChallenges = true;
    await this.getActiveChallenges().then(() => {
      this.loadingActiveChallenges = false;
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['isNewChallenge']) {
      this.isNewChallenge = changes['isNewChallenge'].currentValue;
      if (this.isNewChallenge) {
        await this.getActiveChallenges();
        this.paginationLiteService.currentPage = 1;
        this.paginationLiteService.updateVisibleElements();
      }
    }
  }

  async getActiveChallenges() {
    if (!this.email) return;
    this.activeChallenges = (await this.challengesService.getAllChallenges(
      this.email,
      'activeChallenges'
    )) as IChallenge[];
    this.paginationLiteService.elements = this.activeChallenges;
    this.paginationLiteService.updateVisibleElements();
    if (this.paginationLiteService.visibleElements.length === 0)
      this.paginationLiteService.currentPage--;
    this.paginationLiteService.updateVisibleElements();
  }

  async updateChallenge(challenge: IChallenge) {
    if (!this.email) return;
    if (challenge.total === challenge.read) {
      await this.challengesService
        .addNewChallenge(this.email, 'finishedChallenges', challenge)
        .then(() => this.isFinishedReload.emit(true));
      await this.challengesService.deleteChallenge(
        this.email,
        'activeChallenges',
        challenge.id
      );
      await this.getActiveChallenges().then(() =>
        this.isFinishedReload.emit(false)
      );
    } else {
      await this.challengesService.updateChallenge(
        this.email,
        challenge.id,
        challenge
      );
    }
  }

  async removeChallenge(challengeId: string) {
    if (!this.email) return;
    await this.challengesService.deleteChallenge(
      this.email,
      'activeChallenges',
      challengeId
    );

    await this.getActiveChallenges();
  }
}
