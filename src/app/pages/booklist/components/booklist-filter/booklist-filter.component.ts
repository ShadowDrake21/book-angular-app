import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-booklist-filter',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './booklist-filter.component.html',
  styleUrl: './booklist-filter.component.scss',
})
export class BooklistFilterComponent {
  faStar = faStar;
}
