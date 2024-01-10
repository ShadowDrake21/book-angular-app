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
import { Book } from '../../models/book.model';
import { BookItemComponent } from '../book-item/book-item.component';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, NgFor, BookImagePipe, BookItemComponent],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements AfterViewInit {
  @Input({ required: true }) contents: Book[] = [];
  @Input({ required: true }) title!: string;
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  selectedContent: string | null = null;

  ngAfterViewInit(): void {
    this.initSwiper();
  }

  private initSwiper() {
    return new Swiper(this.swiperContainer.nativeElement, {
      slidesPerView: 5,
      slidesPerGroup: 2,
      centeredSlides: true,
      loop: true,
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
        // 1500: {
        //   slidesPerView: 5,
        //   slidesPerGroup: 5,
        //   spaceBetween: 5,
        //   centeredSlides: false,
        // },
        // 1800: {
        //   slidesPerView: 5,
        //   slidesPerGroup: 6,
        //   spaceBetween: 5,
        //   centeredSlides: false,
        // },
      },
    });
  }

  setHoverBook(item: Book) {
    this.selectedContent = item.title;
  }

  clearHoverBook() {
    this.selectedContent = null;
  }
}