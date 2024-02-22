import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { GenresService } from '../../core/services/genres.service';
import { User } from '@angular/fire/auth';
import { IGenre } from '../../shared/models/genre.model';
import { AuthService } from '../../core/authentication/auth.service';
import { myFavouriteGenresContent } from './content/my-favourite-genres.content';
import { SymbolReplacePipe } from './pipes/symbol-replace.pipe';
import { TextDeletePipe } from '../../shared/pipes/text-delete.pipe';
import { IItemResult } from '../../shared/models/general.model';

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
  newGenres: IGenre[] = [];
  deletedGenres: IGenre[] = [];

  operationName: '' | 'add' | 'delete' = '';
  hasNewGenres: boolean = false;

  genreActionResult!: IItemResult | undefined;

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
    console.log(this.userGenres);

    this.selectedGenres = [];
    this.userGenres.forEach((genre: IGenre) => {
      this.selectedGenres.push(genre);
    });

    this.loadingGenres = false;
    this.hasNewGenres = false;
    this.operationName = '';
  }

  toggleChooseGenre(choosenGenre: IGenre) {
    const btnSelector: Element | null = document.querySelector(
      `#${choosenGenre.name}`
    );
    console.log('saved ', this.userGenres);
    if (btnSelector?.classList.contains('btn-active')) {
      if (this.operationName === 'delete') {
        return;
      }
      this.operationName = 'add';
      btnSelector?.classList.remove('btn-active');
      this.selectedGenres = this.selectedGenres.filter(
        (genre: IGenre) => genre.name !== choosenGenre.name
      );
      this.newGenres = this.newGenres.filter(
        (genre: IGenre) => genre.name !== choosenGenre.name
      );
      if (this.isGenreSaved(choosenGenre)) {
        this.deletedGenres.push(choosenGenre);
      } else if (this.newGenres.length === 0) {
        this.hasNewGenres = false;
      }
    } else {
      if (this.operationName === 'add') {
        return;
      }
      this.operationName = 'delete';
      btnSelector?.classList.add('btn-active');
      this.selectedGenres.push(choosenGenre);
      this.newGenres.push(choosenGenre);
      if (this.isGenreOnDelete(choosenGenre)) {
        this.deletedGenres = this.deletedGenres.filter(
          (genreOnDelete: IGenre) => genreOnDelete.name !== choosenGenre.name
        );
      } else if (!this.isGenreSaved(choosenGenre)) {
        this.hasNewGenres = true;
      }
    }
  }

  async addNewSelectedGenres() {
    if (!this.user?.email) return;
    this.loadingGenres = true;
    await this.genresService.addGenresGroup(
      this.user?.email,
      this.formNewSelectedGroup()
    );
    await this.getUserGenres();
    this.genreActionResult = {
      isSuccessfull: true,
      message: 'Genre successfully added!',
    };
    setTimeout(() => {
      this.genreActionResult = undefined;
    }, 3000);
  }

  async deleteUserGenres() {
    if (this.user?.email) {
      this.loadingGenres = true;
      let userEmail: string = this.user.email;
      let localDeletedGenres: IGenre[] = [];
      let localDeletedGenresIds: string[] = [];
      await Promise.all(
        this.deletedGenres.map(async (deletedGenre: IGenre) => {
          const genreFromDB = (
            (await this.genresService.getGenre(
              userEmail,
              'name',
              deletedGenre.name
            )) as IGenre[]
          )[0];
          localDeletedGenres.push(genreFromDB);
        })
      );

      localDeletedGenres.forEach((localDeletedGenre: IGenre) => {
        console.log(localDeletedGenres);
        if (localDeletedGenre.id)
          localDeletedGenresIds.push(localDeletedGenre.id);
      });

      await this.genresService
        .deleteGenresGroup(this.user.email, localDeletedGenresIds)
        .then(async () => {
          this.deletedGenres = [];
          this.genreActionResult = {
            isSuccessfull: true,
            message: 'Genre successfully deleted!',
          };
          await this.getUserGenres();
          setTimeout(() => {
            this.genreActionResult = undefined;
          }, 3000);
        });
    }
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

  cancelChanges(string: 'add' | 'delete') {
    if (string === 'add') {
      this.operationName = '';

      this.newGenres.forEach((genre: IGenre) => {
        this.selectedGenres = this.selectedGenres.filter(
          (selectedGenre: IGenre) => selectedGenre.name !== genre.name
        );
        this.toggleChooseGenre(genre);
      });
      this.operationName = '';
    } else {
      this.operationName = '';

      this.deletedGenres.forEach((genre: IGenre) => {
        this.selectedGenres.push(genre);
        this.toggleChooseGenre(genre);
      });
      this.operationName = '';
    }

    this.hasNewGenres = false;
    this.newGenres = [];
    this.deletedGenres = [];
  }

  isGenreSaved(genre: IGenre): boolean {
    return this.userGenres.some((userGenre) => userGenre.name === genre.name);
  }

  isGenreOnDelete(genre: IGenre): boolean {
    return this.deletedGenres.some(
      (genreOnDelete) => genreOnDelete.name === genre.name
    );
  }
}
