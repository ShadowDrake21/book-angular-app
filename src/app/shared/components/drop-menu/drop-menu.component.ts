import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClickOutsideDirective } from '../header/directives/click-outside.directive';
import { DropMenu } from '../../models/dropmenu.model';

@Component({
  selector: 'app-drop-menu',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './drop-menu.component.html',
  styleUrl: './drop-menu.component.scss',
})
export class DropMenuComponent {
  isMenuOpened: boolean = false;
  clickedLi: string = 'background-color: rgb(122, 122, 122); color: #fff;';

  dropMenu: Array<DropMenu> = [
    {
      user: 'Drake21',
      img: '/assets/doktor.book_335560326_1185623702313385_2179959843033941049_n.jpg',
      text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis minus eaque saepe ipsum possimus dignissimos!',
      date: 'a month ago',
    },
    {
      user: 'Drake21',
      img: '/assets/doktor.book_335560326_1185623702313385_2179959843033941049_n.jpg',
      text: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quis minus eaque saepe ipsum possimus dignissimos!',
      date: 'a month ago',
    },
  ];
  toggleMenu(): void {
    this.isMenuOpened = !this.isMenuOpened;
  }

  clickedOutside(): void {
    this.isMenuOpened = false;
  }
}
