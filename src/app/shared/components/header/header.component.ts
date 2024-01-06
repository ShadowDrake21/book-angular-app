import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { SearchInputComponent } from '../search-input/search-input.component';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    SearchInputComponent,
    ClickOutsideDirective,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  faBell = faBell;
  faUser = faUser;
  faEnvelope = faEnvelope;

  isMenuOpened: boolean = false;
  clickedLi: string = 'background-color: rgb(122, 122, 122); color: #fff;';

  toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  clickedOutside(): void {
    this.isMenuOpened = false;
    console.log('outside');
  }
}
