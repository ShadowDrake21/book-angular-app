import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UseritemPrebookmarksBooksComponent } from './components/useritem-prebookmarks-books/useritem-prebookmarks-books.component';
import { UseritemPrebookmarksAuthorsComponent } from './components/useritem-prebookmarks-authors/useritem-prebookmarks-authors.component';

@Component({
  selector: 'app-useritem-prebookmarks',
  standalone: true,
  imports: [
    CommonModule,
    UseritemPrebookmarksBooksComponent,
    UseritemPrebookmarksAuthorsComponent,
  ],
  templateUrl: './useritem-prebookmarks.component.html',
  styleUrl: './useritem-prebookmarks.component.scss',
})
export class UseritemPrebookmarksComponent {
  @Input({ required: true }) userEmail: string | null | undefined = '';
  @Output() countBooks = new EventEmitter<number>();
  @Output() countAuthors = new EventEmitter<number>();
}
