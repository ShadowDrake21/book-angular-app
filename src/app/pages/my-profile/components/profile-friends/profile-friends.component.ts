import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { IFriend } from '../../../../shared/models/friendsManagement.model';

@Component({
  selector: 'app-profile-friends',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile-friends.component.html',
  styleUrl: './profile-friends.component.scss',
})
export class ProfileFriendsComponent implements OnInit {
  @Input() user!: User | null;
  itemsPerPage: number = 5;
  currentPage: number = 1;

  visibleFriends: IFriend[] = [];
  friendDummy: IFriend = {
    id: 'hq3aIcRwKQRnYqOoISCFw606aV72',
    name: 'Hater',
    photoURL:
      'https://4.bp.blogspot.com/-q-RQCz9hZx8/VKg1RYm568I/AAAAAAAARyg/uE8UHQrvess/s1600/Being%2BCalled%2Ba%2BHater.png',
  };
  friends: IFriend[] = [
    this.friendDummy,
    this.friendDummy,
    this.friendDummy,
    this.friendDummy,
    this.friendDummy,
    this.friendDummy,
  ];

  ngOnInit(): void {
    this.updateVisible();
  }

  updateVisible() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.visibleFriends = this.friends.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.numPages()) {
      this.currentPage++;
      this.updateVisible();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateVisible();
    }
  }

  numPages(): number {
    return Math.ceil(this.friends.length / this.itemsPerPage);
  }
}
