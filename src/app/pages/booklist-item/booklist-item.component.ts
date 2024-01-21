import { Component, OnInit, inject } from '@angular/core';
import { BooksService } from '../../core/services/books.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IWork } from '../../shared/models/book.model';
import { BookImagePipe } from '../../shared/pipes/book-image.pipe';
import { CommonModule } from '@angular/common';
import { TruncateTextPipe } from '../../shared/pipes/truncate-text.pipe';
import { ObjectManipulations } from '../../shared/utils/objectManipulations.utils';
import { IAuthor } from '../../shared/models/author.model';
import { AuthorImagePipe } from '../../shared/pipes/author-image.pipe';

@Component({
  selector: 'app-booklist-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BookImagePipe,
    AuthorImagePipe,
    TruncateTextPipe,
  ],
  templateUrl: './booklist-item.component.html',
  styleUrl: './booklist-item.component.scss',
})
export class BooklistItemComponent implements OnInit {
  booksService = inject(BooksService);
  route = inject(ActivatedRoute);

  path!: string;
  loadingBook?: boolean;

  book!: IWork;
  mainCover!: string;

  descriptionBtn: string = 'Show more';
  descriptionShowLength: number = 300;
  isDescriptionFullText: boolean = false;

  basicToggleItems: number = 5;

  characters: string[] = [];
  charactersBtn: string = 'Show all characters';
  isAllCharacters: boolean = false;

  places: string[] = [];
  placesBtn: string = 'Show all places';
  isAllPlaces: boolean = false;

  subjects: string[] = [];
  subjectsBtn: string = 'Show all subjects';
  isAllSubjects: boolean = false;

  authors: IAuthor[] = [];
  authorKeys: string[] = [];
  loadingAuthor?: boolean;

  ngOnInit(): void {
    this.path = this.route.snapshot.url[1].path;

    this.loadingBook = true;
    this.booksService.getWorkByKey(this.path).subscribe((res) => {
      this.book = res;
      this.mainCover = this.book.covers && this.book.covers[0].toString();
      this.characters = ObjectManipulations.checkIfHasKey(
        this.book,
        'subject_people'
      )
        ? this.book.subject_people.slice(0, this.basicToggleItems)
        : [];
      this.places = ObjectManipulations.checkIfHasKey(
        this.book,
        'subject_places'
      )
        ? this.book.subject_places.slice(0, this.basicToggleItems)
        : [];
      this.subjects = ObjectManipulations.checkIfHasKey(this.book, 'subjects')
        ? this.book.subjects.slice(0, this.basicToggleItems)
        : [];
      console.log(this.book);
      this.loadingAuthor = true;
      this.getAuthors();
      this.loadingBook = false;
    });
  }

  showCloseDescription() {
    let descriptionLength = this.book.description.value
      ? this.book.description.value.length
      : this.book.description.toString().length;
    if (this.descriptionBtn === 'Show more') {
      this.descriptionBtn = 'Hide';
      this.descriptionShowLength = descriptionLength;
      this.isDescriptionFullText = true;
    } else {
      this.descriptionBtn = 'Show more';
      this.descriptionShowLength = 300;
      this.isDescriptionFullText = false;
    }
  }

  toggleList(type: string) {
    switch (type) {
      case 'characters':
        if (!this.isAllCharacters) {
          this.characters = [];
          this.characters = this.book.subject_people;
          this.isAllCharacters = true;
          this.charactersBtn = 'Hide';
        } else {
          this.characters = [];
          this.characters = this.book.subject_people.slice(
            0,
            this.basicToggleItems
          );
          this.isAllCharacters = false;
          this.charactersBtn = 'Show all characters';
        }
        break;
      case 'places':
        if (!this.isAllPlaces) {
          this.places = [];
          this.places = this.book.subject_places;
          this.isAllPlaces = true;
          this.placesBtn = 'Hide';
        } else {
          this.places = [];
          this.places = this.book.subject_places.slice(
            0,
            this.basicToggleItems
          );
          this.isAllPlaces = false;
          this.placesBtn = 'Show all';
        }
        break;
      case 'subjects':
        if (!this.isAllSubjects) {
          this.subjects = [];
          this.subjects = this.book.subjects;
          this.isAllSubjects = true;
          this.subjectsBtn = 'Hide';
        } else {
          this.subjects = [];
          this.subjects = this.book.subjects.slice(0, this.basicToggleItems);
          this.isAllSubjects = false;
          this.subjectsBtn = 'Show all';
        }
        break;
    }
  }

  getAuthors() {
    for (const author of this.book.authors) {
      let authorKey = author.author.key.slice(9, author.author.key.length);
      this.authorKeys.push(authorKey);
      this.booksService.getAuthorByKey(authorKey).subscribe((res) => {
        this.authors.push(res);
        console.log(this.authors);
      });
    }
    this.loadingAuthor = false;
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }
}
