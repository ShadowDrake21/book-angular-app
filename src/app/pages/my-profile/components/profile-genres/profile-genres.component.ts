import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { GenresService } from '../../../../core/services/genres.service';
import { IGenre } from '../../../../shared/models/genre.model';
import { SymbolReplacePipe } from '../../../../shared/pipes/symbol-replace.pipe';

@Component({
  selector: 'app-profile-genres',
  standalone: true,
  imports: [CommonModule, RouterModule, SymbolReplacePipe],
  templateUrl: './profile-genres.component.html',
  styleUrl: './profile-genres.component.scss',
})
export class ProfileGenresComponent implements OnInit {
  private genresService = inject(GenresService);
  @Input() user!: User | null;

  loadingGenres!: boolean;
  genres: IGenre[] = [];

  async ngOnInit(): Promise<void> {
    if (!this.user?.email) return;
    this.loadingGenres = true;
    this.genres = await this.genresService.getAllGenres(this.user?.email);
    this.loadingGenres = false;
  }
}
