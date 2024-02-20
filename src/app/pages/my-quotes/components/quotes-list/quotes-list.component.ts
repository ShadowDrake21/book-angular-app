import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IQuote } from '../../../../shared/models/quote.model';

@Component({
  selector: 'app-quotes-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quotes-list.component.html',
  styleUrl: './quotes-list.component.scss',
})
export class QuotesListComponent implements OnInit, OnChanges {
  @Input() quotes: IQuote[] = [];
  @Output() onEdit = new EventEmitter<string>();
  @Output() onDelete = new EventEmitter<string>();

  ngOnInit(): void {
    console.log('on init: ', this.quotes);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['quotes']) {
      this.quotes = changes['quotes'].currentValue;
      console.log('on changes: ', this.quotes);
    }
  }
}
