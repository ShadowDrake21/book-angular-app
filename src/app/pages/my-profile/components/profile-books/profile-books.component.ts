import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { User } from '@angular/fire/auth';
import { IWork } from '../../../../shared/models/book.model';
import { WorkItemComponent } from '../../../../shared/components/work-item/work-item.component';
import { FavouriteBooksService } from '../../../../core/services/favourite-books.service';

@Component({
  selector: 'app-profile-books',
  standalone: true,
  imports: [CommonModule, WorkItemComponent],
  providers: [FavouriteBooksService],
  templateUrl: './profile-books.component.html',
  styleUrl: './profile-books.component.scss',
})
export class ProfileBooksComponent implements OnInit {
  protected favouriteBooksService = inject(FavouriteBooksService);

  @Input() user!: User | null;

  async ngOnInit(): Promise<void> {
    this.favouriteBooksService.userEmail = this.user?.email;
    await this.favouriteBooksService.loadingItems();
  }
}
