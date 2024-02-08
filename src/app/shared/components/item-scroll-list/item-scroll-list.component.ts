import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { IItemScrollList } from '../../models/itemScrollList.model';

@Component({
  selector: 'app-item-scroll-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './item-scroll-list.component.html',
  styleUrl: './item-scroll-list.component.scss',
})
export class ItemScrollListComponent implements OnInit, OnChanges {
  @Input({ required: true }) itemObj!: IItemScrollList;
  @Input({ required: true }) listTitle: string = '';
  basicToggleItems: number = 5;

  allItems: string[] = [];
  showItems: string[] = [];
  isAllItems: boolean = false;
  isLinks: boolean = false;
  btnText: string = '';

  ngOnInit(): void {
    this.destructureItemListObject();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemObj']) {
      this.itemObj = changes['itemObj'].currentValue;
      this.destructureItemListObject();
    }
  }

  destructureItemListObject() {
    const { items, isLinks, btnText } = this.itemObj;
    this.allItems = items;
    this.showItems = items.length ? items.slice(0, this.basicToggleItems) : [];
    this.isAllItems = false;
    this.isLinks = isLinks;
    this.btnText = btnText;
  }

  toggleList() {
    if (!this.isAllItems) {
      this.showItems = [];
      this.showItems = this.allItems;
      this.isAllItems = true;
      this.btnText = 'Hide';
    } else {
      this.showItems = [];
      this.showItems = this.allItems.slice(0, this.basicToggleItems);
      this.isAllItems = false;
      this.btnText = 'Show all';
    }
  }
}
