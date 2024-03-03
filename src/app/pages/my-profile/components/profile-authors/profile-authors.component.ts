import { Component, Input, OnInit, inject } from '@angular/core';
import { AuthorItemComponent } from '../../../../shared/components/author-item/author-item.component';
import { CommonModule } from '@angular/common';
import { User } from '@angular/fire/auth';
import { FavouriteAuthorsService } from '../../../../core/services/favourite-authors.service';
import { FloatingMessageComponent } from '../../../../shared/components/floating-message/floating-message.component';

@Component({
  selector: 'app-profile-authors',
  standalone: true,
  imports: [CommonModule, AuthorItemComponent, FloatingMessageComponent],
  providers: [FavouriteAuthorsService],
  templateUrl: './profile-authors.component.html',
  styleUrl: './profile-authors.component.scss',
})
export class ProfileAuthorsComponent implements OnInit {
  protected favouriteAuthorsService = inject(FavouriteAuthorsService);

  @Input({ required: true }) user!: User | null;

  async ngOnInit(): Promise<void> {
    this.favouriteAuthorsService.userEmail = this.user?.email;
    await this.favouriteAuthorsService.loadingItems();
  }
}
