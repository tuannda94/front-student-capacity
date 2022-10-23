import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { Contest } from 'src/app/models/contest';
import { Post } from 'src/app/models/post.model';
import { UserService } from 'src/app/services/user.service';
import { WishlistService } from 'src/app/services/wishlist.service';

@Component({
  selector: 'app-recruitment-position',
  templateUrl: './recruitment-position.component.html',
  styleUrls: ['./recruitment-position.component.css'],
})
export class RecruitmentPositionComponent implements OnInit {
  @Input() item: Post;
  @Output() requestFavorite = new EventEmitter<Post>();
  constructor(
    private userService: UserService,
    private wishlist: WishlistService,
    private router: Router,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {}

  favoriteEvent(event: any, item: Post) {
    const data = {
      type: 'post',
      id: item.id,
    };
    if (!this.userService.getUserValue()) {
      this.router.navigate(['/login']);
    } else {
      this.requestFavorite.emit(item);
      if (item.user_wishlist) {
        event.currentTarget.classList.remove('primary-color');
        event.currentTarget.parentElement.classList.remove('opacity-100');
        event.currentTarget.parentElement.classList.add(
          'my-add-favorite__icon'
        );
        this.wishlist.wishListRemove(data).subscribe((res) => {
          if (res.status) {
            this.toast.success({ summary: res.payload, duration: 2000 });
          }
        });
      } else {
        event.currentTarget.classList.add('primary-color');
        event.currentTarget.parentElement.classList.add('opacity-100');
        event.currentTarget.parentElement.classList.remove(
          'my-add-favorite__icon'
        );
        this.wishlist.wishListAdd(data).subscribe((res) => {
          if (res.status) {
            this.toast.success({ summary: res.payload, duration: 2000 });
          }
        });
      }
    }
  }
}
