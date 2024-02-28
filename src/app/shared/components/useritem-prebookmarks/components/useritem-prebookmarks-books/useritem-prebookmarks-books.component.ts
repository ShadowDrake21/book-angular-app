import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { UseritemBookmarksComponent } from '../../../useritem-bookmarks/useritem-bookmarks.component';
import { FavouriteBooksService } from '../../../../../core/services/favourite-books.service';

@Component({
  selector: 'app-useritem-prebookmarks-books',
  standalone: true,
  imports: [CommonModule, UseritemBookmarksComponent],
  providers: [FavouriteBooksService],
  templateUrl: './useritem-prebookmarks-books.component.html',
  styleUrl: './useritem-prebookmarks-books.component.scss',
})
export class UseritemPrebookmarksBooksComponent implements OnInit {
  protected favouriteBooksService = inject(FavouriteBooksService);

  @Input({ required: true }) email: string | null | undefined = '';
  @Output() countBooks = new EventEmitter<number>();

  async ngOnInit(): Promise<void> {
    this.favouriteBooksService.userEmail = this.email;
    await this.favouriteBooksService.loadingItems();
    this.countBooks.emit(this.favouriteBooksService.userBookBookmarks.length);
  }
}
