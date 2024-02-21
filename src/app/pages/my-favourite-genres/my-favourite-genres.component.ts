import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { GenresService } from '../../core/services/genres.service';
import { User } from '@angular/fire/auth';
import { IGenre } from '../../shared/models/genre.model';
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

  availableGenres: IGenre[] = myFavouriteGenresContent;

  loadingGenres!: boolean;
  userGenres: IGenre[] = [];

  selectedGenres: IGenre[] = [];

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

  toggleChooseGenre(choosenGenre: IGenre) {
    const btnSelector: Element | null = document.querySelector(
      `#${choosenGenre.name}`
    );
    if (btnSelector?.classList.contains('btn-active')) {
      btnSelector?.classList.remove('btn-active');
      this.selectedGenres = this.selectedGenres.filter(
        (genre: IGenre) => genre.name !== choosenGenre.name
      );
    } else {
      btnSelector?.classList.add('btn-active');
      this.selectedGenres.push(choosenGenre);
    }
    console.log('selectedGenres: ', this.selectedGenres);
  }

  async addNewSelectedGenres() {
    if (!this.user?.email) return;
    await this.genresService.addGenresGroup(
      this.user?.email,
      this.formNewSelectedGroup()
    );
  }

  formNewSelectedGroup(): IGenre[] {
    let newSelectedGenres: IGenre[] = [];
    for (let i = 0; i < this.selectedGenres.length; i++) {
      const element = this.selectedGenres[i];
      const isElementNotInUserGenres =
        this.userGenres.findIndex(
          (userGenre: IGenre) => userGenre.name === element.name
        ) === -1;

      const isElementNotInNewSelectedGenres =
        newSelectedGenres.findIndex(
          (selectedGenre: IGenre) => selectedGenre.name === element.name
        ) === -1;

      if (isElementNotInUserGenres && isElementNotInNewSelectedGenres) {
        element.id = 'genre' + Math.random().toString(16).slice(2);
        newSelectedGenres.push(element);
      }
    }
    return newSelectedGenres;
  }
}
