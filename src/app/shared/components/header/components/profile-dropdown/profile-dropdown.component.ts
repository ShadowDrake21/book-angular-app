import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { TruncateTextPipe } from '../../../../pipes/truncate-text.pipe';
import { profile } from '../../content/header.content';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-profile-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    ClickOutsideDirective,
    TruncateTextPipe,
  ],
  templateUrl: './profile-dropdown.component.html',
  styleUrl: './profile-dropdown.component.scss',
})
export class ProfileDropdownComponent {
  @Input({ required: true }) userEmail: string = '';
  @Input({ required: true }) clickedLi!: string;

  faUser = faUser;
  profile = profile;
  isProfileOpened: boolean = false;

  toggleProfile(): void {
    this.isProfileOpened = !this.isProfileOpened;
  }

  clickedProfileOutside(): void {
    this.isProfileOpened = false;
  }
}
