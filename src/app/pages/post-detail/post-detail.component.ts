import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { ListPostService } from 'src/app/services/list-post.service';
import { Post } from 'src/app/models/post.model';
import { ModalUploadCvComponent } from 'src/app/modal/modal-upload-cv/modal-upload-cv.component';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  postDetail!: Post;
  statusPost: boolean = false;
  routeCategoryPost: string = '';

  constructor(
    private postService: ListPostService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public title: Title
  ) {}

  ngOnInit(): void {
    this.backTop();
    this.title.setTitle('Chi tiết bài viết');

    this.route.paramMap
      .pipe(
        map((params) => params.get('slug')),
        switchMap((slug) => this.postService.getPostBySlug(slug))
      )
      .subscribe((res) => {
        if (res.status) {
          this.postDetail = res.payload;
          this.postDetail.postable_type === 'App\\Models\\Contest'
            ? ((this.postDetail.postable_type = 'Cuộc thi'),
              (this.routeCategoryPost = 'post-contest'))
            : this.postDetail.postable_type === 'App\\Models\\Recruitment'
            ? ((this.postDetail.postable_type = 'Tuyển dụng'),
              (this.routeCategoryPost = 'post-recruitment'))
            : ((this.postDetail.postable_type = 'Test năng lực'),
              (this.routeCategoryPost = 'post-capacity'));
          this.postDetail ? (this.statusPost = true) : this.statusPost;
        }
      });
  }

  // Change screen back top
  backTop() {
    $('html , body').animate(
      {
        scrollTop: 0,
      },
      1000
    );
  }

  // Open-modal upload cv
  openModal() {
    const dialogRef = this.dialog.open(ModalUploadCvComponent, {
      width: '700px',
      data: {
        postDetail: this.postDetail,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('result', result);
    });
  }
  clickChangeUrlToCategoryPost(data: string) {
    this.router.navigateByUrl(`danh-muc-bai-viet?cate=${data}`);
  }
}
