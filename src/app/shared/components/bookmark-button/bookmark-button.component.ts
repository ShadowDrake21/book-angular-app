import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bookmark-button',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './bookmark-button.component.html',
  styleUrl: './bookmark-button.component.scss',
})
export class BookmarkButtonComponent {
  faBookmark = faBookmark;
  @Input({ required: true }) isBookmarked: boolean = false;
  @Output() bookmarkedChange = new EventEmitter<boolean>();

  toggleBookmark() {
    this.isBookmarked = !this.isBookmarked;
    this.bookmarkedChange.emit(this.isBookmarked);
  }
}
