import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';

@Component({
  selector: 'app-booklist-filter',
  standalone: true,
  imports: [FontAwesomeModule, ButtonComponent],
  templateUrl: './booklist-filter.component.html',
  styleUrl: './booklist-filter.component.scss',
})
export class BooklistFilterComponent {
  faStar = faStar;
}
