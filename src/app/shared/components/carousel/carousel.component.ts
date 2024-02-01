import { CommonModule, NgFor } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import Swiper from 'swiper';
import { BookImagePipe } from '../../pipes/book-image.pipe';
import { IBook, IWork } from '../../models/book.model';
import { BookItemComponent } from '../book-item/book-item.component';
import { RouterModule } from '@angular/router';
import { WorkItemComponent } from '../work-item/work-item.component';
import { IAuthor } from '../../models/author.model';
import { AuthorItemComponent } from '../author-item/author-item.component';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    BookImagePipe,
    RouterModule,
    BookItemComponent,
    WorkItemComponent,
    AuthorItemComponent,
  ],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements AfterViewInit {
  @Input() contentsBooks: IBook[] = [];
  @Input() contentsWorks: IWork[] = [];
  @Input() contentsAuthors: IAuthor[] = [];
  @Input({ required: true }) title!: string;
  @Input() queryType: 'subject' | 'author' | 'none' = 'subject';
  @Input() carouselLink!: string;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  selectedContent: string | null = null;

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  private initSwiper() {
    return new Swiper(this.swiperContainer.nativeElement, {
      slidesPerView: 3,
      slidesPerGroup: 2,
      centeredSlides: true,
      loop: false,
      breakpoints: {
        600: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 5,
          centeredSlides: true,
        },
        900: {
          slidesPerView: 3,
          slidesPerGroup: 3,
          spaceBetween: 5,
          centeredSlides: true,
        },
        1200: {
          slidesPerView: 4,
          slidesPerGroup: 4,
          spaceBetween: 5,
          centeredSlides: false,
        },
        1500: {
          slidesPerView: 5,
          slidesPerGroup: 5,
          spaceBetween: 5,
          centeredSlides: false,
        },
        1800: {
          slidesPerView: 5,
          slidesPerGroup: 6,
          spaceBetween: 5,
          centeredSlides: false,
        },
      },
    });
  }

  setHoverBook(item: IBook | IWork) {
    this.selectedContent = item.title;
  }

  setHoverAuthor(item: IAuthor) {
    this.selectedContent = item.name;
  }

  clearHoverBook() {
    this.selectedContent = null;
  }
}
