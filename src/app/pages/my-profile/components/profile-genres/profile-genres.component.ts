import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { User } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile-genres',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-genres.component.html',
  styleUrl: './profile-genres.component.scss',
})
export class ProfileGenresComponent {
  @Input() user!: User | null;

  genres: string[] = [
    'biography',
    'classics',
    'fantasy',
    'history',
    'comedy',
    'romance',
    'science',
    'young-adult',
    'biography',
    'classics',
    'fantasy',
    'history',
    'comedy',
    'romance',
    'science',
    'young-adult',
    'biography',
    'classics',
    'fantasy',
    'history',
    'comedy',
    'romance',
    'science',
    'young-adult',
  ];
}
