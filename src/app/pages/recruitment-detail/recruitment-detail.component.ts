import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { Capacity } from 'src/app/models/capacity';
import { Post } from 'src/app/models/post.model';
import { Recruitments } from 'src/app/models/recruitments.models';
import { TransmitToPost } from 'src/app/models/transmit-to-post.models';
import { ListPostService } from 'src/app/services/list-post.service';
import { RecruitmentsService } from 'src/app/services/recruitments.service';

@Component({
  selector: 'app-recruitment-detail',
  templateUrl: './recruitment-detail.component.html',
  styleUrls: ['./recruitment-detail.component.css']
})
export class RecruitmentDetailComponent implements OnInit {
  recruitmentDetail : Recruitments;
  statusListCapacity : boolean = false;
  recruitmentCapacity : Array<Capacity>;
  cinfigData: TransmitToPost;
  listPostResult : Array<Post>;
  statusPage: boolean = true;

  constructor(private route: ActivatedRoute ,
    public postService:  ListPostService,
    private recruitmentService: RecruitmentsService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.backTop();
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      switchMap(id => this.recruitmentService.getRecruitmentDetail(id))
    )
    .subscribe(res => {
      if(res.status){
        this.recruitmentCapacity = res.payload.contest;
        this.recruitmentCapacity ? this.statusListCapacity = true : this.statusListCapacity;
        this.recruitmentDetail = res.payload;
        if( this.recruitmentDetail) this.statusPage = false;        
      }
    })

    this.getListPost();
   
  }


  
  // Back top after load page
  backTop() {
    $('html , body').animate(
      {
        scrollTop: 0,
      },
      1000
    );
  }

// List Posts
  getListPost() {
    this.postService.getPostWhereCate('post-recruitment').subscribe(res => {
     if(res.status){
       this.listPostResult = res.payload.data.filter((item : Post , index: number) => {
        return index < 4;
        });
     }
   })
  }
}
