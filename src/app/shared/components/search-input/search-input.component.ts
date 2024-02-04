import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent {
  faSearch = faSearch;

  @Output() searchTerm = new EventEmitter<string>();

  searchByTitleForm = new FormGroup({
    title: new FormControl('', Validators.required),
  });

  onSubmit() {
    if (this.searchByTitleForm.value.title) {
      this.searchTerm.emit(this.searchByTitleForm.value.title);
    } else {
      console.log('Empty search');
    }
  }
}
