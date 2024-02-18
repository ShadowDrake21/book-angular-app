import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { IFriend } from '../../../../shared/models/friendsManagement.model';
import { PaginationLiteService } from '../../../../core/services/pagination-lite.service';

@Component({
  selector: 'app-profile-friends',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [PaginationLiteService],
  templateUrl: './profile-friends.component.html',
  styleUrl: './profile-friends.component.scss',
})
export class ProfileFriendsComponent implements OnInit {
  protected paginationLiteService = inject(PaginationLiteService);

  @Input() user!: User | null;

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
    this.paginationLiteService.elements = this.friends;
    this.paginationLiteService.updateVisibleElements();
  }
}
