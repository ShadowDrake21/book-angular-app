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
import { AuthService } from '../../../../core/authentication/auth.service';
import { User } from '@angular/fire/auth';
import { Subject, takeUntil } from 'rxjs';
import { ReadingChallengeItemComponent } from '../reading-challenge-item/reading-challenge-item.component';
import { PaginationLiteService } from '../../../../core/services/pagination-lite.service';
import { ReadingChallengeFinishedComponent } from '../reading-challenge-finished/reading-challenge-finished.component';
import { ReadingChallengeActiveComponent } from '../reading-challenge-active/reading-challenge-active.component';

@Component({
  selector: 'app-reading-challenge',
  standalone: true,
  imports: [
    CommonModule,
    ReadingChallengeItemComponent,
    ReadingChallengeFinishedComponent,
    ReadingChallengeActiveComponent,
  ],
  providers: [PaginationLiteService],
  templateUrl: './reading-challenge.component.html',
  styleUrl: './reading-challenge.component.scss',
})
export class ReadingChallengeComponent implements OnInit, OnChanges, OnDestroy {
  private authService = inject(AuthService);
  protected paginationLiteService = inject(PaginationLiteService);

  @Input() isNewChallenge!: boolean;

  user!: User | null;
  destroy$: Subject<null> = new Subject();

  isFinishedReload: boolean = false;

  ngOnInit(): void {
    this.authService.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (user: User | null) => {
        this.user = user;
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isNewChallenge']) {
      this.isNewChallenge = changes['isNewChallenge'].currentValue;
    }
  }

  getIsFinishedReload(value: boolean) {
    this.isFinishedReload = value;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }
}
