import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/authentication/auth.service';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { User } from '@angular/fire/auth';
import { ProfileChallengesComponent } from './components/profile-challenges/profile-challenges.component';
import { Router, RouterModule } from '@angular/router';
import { IChallenge } from '../../shared/models/challenge.model';
import { ProfileBooksComponent } from './components/profile-books/profile-books.component';
import { ProfileAuthorsComponent } from './components/profile-authors/profile-authors.component';
import { ProfileStatisticsComponent } from './components/profile-statistics/profile-statistics.component';
import { ProfileFriendsComponent } from './components/profile-friends/profile-friends.component';
import { ProfileGenresComponent } from './components/profile-genres/profile-genres.component';
import { ChallengesService } from '../../core/services/challenges.service';
import { FloatingMessageComponent } from '../../shared/components/floating-message/floating-message.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProfileInfoComponent,
    ProfileChallengesComponent,
    ProfileBooksComponent,
    ProfileAuthorsComponent,
    ProfileStatisticsComponent,
    ProfileFriendsComponent,
    ProfileGenresComponent,
    FloatingMessageComponent,
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private challengesService = inject(ChallengesService);
  private router = inject(Router);

  loadingUser!: boolean;
  user: User | null = null;

  loadingChallenges!: boolean;
  challenges: IChallenge[] = [];

  ngOnInit(): void {
    this.loadingUser = true;
    this.loadingChallenges = true;
    this.authService.user$.subscribe((data: User | null) => {
      this.user = data;
      this.loadingUser = false;
      this.getUserChallenges();
    });
  }

  getUserChallenges() {
    if (!this.user?.email) return;
    this.challengesService
      .getAllChallenges(this.user?.email, 'activeChallenges')
      .then((challenges: IChallenge[]) => {
        this.challenges = challenges;
        this.loadingChallenges = false;
      });
  }

  viewChallenges() {
    this.router.navigate(['/my-reading-challenges']);
  }
}
