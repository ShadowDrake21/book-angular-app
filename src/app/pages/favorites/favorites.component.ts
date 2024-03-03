import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../core/services/books.service';
import { AuthorsService } from '../../core/services/authors.service';
import { AuthService } from '../../core/authentication/auth.service';
import { BookmarkService } from '../../core/services/bookmark.service';
import { UseritemBookmarksComponent } from '../../shared/components/useritem-bookmarks/useritem-bookmarks.component';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';
import { UseritemPrebookmarksComponent } from '../../shared/components/useritem-prebookmarks/useritem-prebookmarks.component';
import { FloatingMessageComponent } from '../../shared/components/floating-message/floating-message.component';

@Component({
  selector: 'app-favbooks',
  standalone: true,
  imports: [
    CommonModule,
    UseritemBookmarksComponent,
    TruncateTextPipe,
    UseritemPrebookmarksComponent,
    FloatingMessageComponent,
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent implements OnInit {
  private authService = inject(AuthService);

  loadingUserEmail!: boolean;
  userEmail!: string | null | undefined;

  ngOnInit(): void {
    this.loadingUserEmail = true;
    this.authService.user$.subscribe(async (data) => {
      this.userEmail = data?.email;
      this.loadingUserEmail = false;
    });
  }
}
