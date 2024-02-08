import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../core/authentication/auth.service';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { User } from '@angular/fire/auth';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ProfileChallengesComponent } from './components/profile-challenges/profile-challenges.component';
import { Router } from '@angular/router';
import { IChallenge } from '../../shared/models/challenge.model';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [CommonModule, ProfileInfoComponent, ProfileChallengesComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
})
export class MyProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user: User | null = null;

  challenge: IChallenge = {
    title: 'Fantasy on 2024',
    total: 77,
    read: 46,
    image: 'https://i.insider.com/61117f8f2a24d0001862714c?width=700',
  };

  ngOnInit(): void {
    this.authService.user$.subscribe((data: User | null) => {
      this.user = data;
    });
  }

  viewChallenges() {
    this.router.navigate(['/my-reading-challenges']);
  }
}
