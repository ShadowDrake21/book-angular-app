import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { GenresService } from '../../core/services/genres.service';
import { User } from '@angular/fire/auth';
import { IAvailableGenre, IGenre } from '../../shared/models/genre.model';
import { AuthService } from '../../core/authentication/auth.service';
import { myFavouriteGenresContent } from './content/my-favourite-genres.content';
import { SymbolReplacePipe } from './pipes/symbol-replace.pipe';
import { TextDeletePipe } from '../../shared/pipes/text-delete.pipe';

@Component({
  selector: 'app-my-favourite-genres',
  standalone: true,
  imports: [CommonModule, SymbolReplacePipe, TextDeletePipe],
  templateUrl: './my-favourite-genres.component.html',
  styleUrl: './my-favourite-genres.component.scss',
})
export class MyFavouriteGenresComponent implements OnInit {
  private authService = inject(AuthService);
  private genresService = inject(GenresService);

  loadingUser!: boolean;
  user: User | null = null;

  availableGenres: IAvailableGenre[] = myFavouriteGenresContent;

  loadingGenres!: boolean;
  userGenres: IGenre[] = [];

  async ngOnInit(): Promise<void> {
    this.loadingUser = true;
    this.loadingGenres = true;
    this.authService.user$.subscribe(async (user: User | null) => {
      this.user = user;
      this.loadingUser = false;
      await this.getUserGenres();
    });
  }

  async getUserGenres() {
    if (!this.user?.email) return;
    this.userGenres = await this.genresService.getAllGenres(this.user?.email);
    this.loadingGenres = false;
  }

  toggleChooseGenre(choosenGenre: IAvailableGenre) {
    const btnSelector: Element | null = document.querySelector(
      `#${choosenGenre.name}`
    );
    if (btnSelector?.classList.contains('btn-active')) {
      btnSelector?.classList.remove('btn-active');
    } else {
      btnSelector?.classList.add('btn-active');
    }
  }
}
