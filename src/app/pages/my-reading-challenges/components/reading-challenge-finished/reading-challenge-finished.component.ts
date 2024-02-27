import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { PaginationLiteService } from '../../../../core/services/pagination-lite.service';
import { CommonModule } from '@angular/common';
import { ChallengesService } from '../../../../core/services/challenges.service';
import { IChallenge } from '../../../../shared/models/challenge.model';
import { ReadingChallengeItemComponent } from '../reading-challenge-item/reading-challenge-item.component';

@Component({
  selector: 'app-reading-challenge-finished',
  standalone: true,
  imports: [CommonModule, ReadingChallengeItemComponent],
  providers: [PaginationLiteService],
  templateUrl: './reading-challenge-finished.component.html',
  styleUrl: './reading-challenge-finished.component.scss',
})
export class ReadingChallengeFinishedComponent implements OnInit, OnChanges {
  private challengesService = inject(ChallengesService);
  protected paginationLiteService = inject(PaginationLiteService);

  @Input() email!: string | null | undefined;
  @Input() isReload!: boolean;

  loadingFinishedChallenges!: boolean;
  finishedChallenges: IChallenge[] = [];

  async ngOnInit(): Promise<void> {
    this.loadingFinishedChallenges = true;
    await this.getFinishedChallenges().then(() => {
      this.loadingFinishedChallenges = false;
    });
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['isReload']) {
      this.isReload = changes['isReload'].currentValue;
      if (this.isReload) {
        await this.getFinishedChallenges();
        this.paginationLiteService.currentPage = 1;
        this.paginationLiteService.updateVisibleElements();
      }
    }
  }

  async getFinishedChallenges() {
    if (!this.email) return;
    this.finishedChallenges = (await this.challengesService.getAllChallenges(
      this.email,
      'finishedChallenges'
    )) as IChallenge[];
    this.paginationLiteService.elements = this.finishedChallenges;
    this.paginationLiteService.updateVisibleElements();
    if (this.paginationLiteService.visibleElements.length === 0)
      this.paginationLiteService.currentPage--;
    this.paginationLiteService.updateVisibleElements();
  }

  async removeChallenge(challengeId: string) {
    if (!this.email) return;
    await this.challengesService.deleteChallenge(
      this.email,
      'finishedChallenges',
      challengeId
    );

    await this.getFinishedChallenges();
  }
}
