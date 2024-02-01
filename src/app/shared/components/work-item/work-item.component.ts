import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BookImagePipe } from '../../pipes/book-image.pipe';
import { IWork } from '../../models/book.model';

@Component({
  selector: 'app-work-item',
  standalone: true,
  imports: [CommonModule, RouterModule, BookImagePipe],
  templateUrl: './work-item.component.html',
  styleUrl: './work-item.component.scss',
})
export class WorkItemComponent implements OnChanges {
  @Input({ required: true }) book!: IWork;
  keyCode!: string;
  mainCover!: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['book']) {
      this.keyCode = changes['book'].currentValue.key.slice(
        7,
        this.book.key.length
      );
      this.mainCover = this.book.covers && this.book.covers[0].toString();
    }
  }
}
