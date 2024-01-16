import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import { BooklistFilterContent } from './content/booklist-filter.content';
import { IBooklistFilter } from './models/booklist-filter.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-booklist-filter',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ButtonComponent],
  templateUrl: './booklist-filter.component.html',
  styleUrl: './booklist-filter.component.scss',
})
export class BooklistFilterComponent {
  [x: string]: any;
  faStar = faStar;

  filterContent: IBooklistFilter = BooklistFilterContent;

  generateStarsArray(starsNumber: number): number[] {
    return Array(starsNumber);
  }
}
