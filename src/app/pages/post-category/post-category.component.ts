import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { ListPostService } from 'src/app/services/list-post.service';

@Component({
  selector: 'app-post-category',
  templateUrl: './post-category.component.html',
  styleUrls: ['./post-category.component.css']
})
export class PostCategoryComponent implements OnInit {
  ListPost: Post[] | null


  constructor(
    private postService : ListPostService,
    private router: Router,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
    let typePost= this.route.snapshot.queryParamMap.get('cate')
    if(typePost == 'post-recruitment'){
      let listTab = document.querySelectorAll('.post__nav-item')
      let type = document.querySelector('.recruitment')

      listTab.forEach(item =>{
        item.classList.remove('active')
      })
      type?.classList.add('active')
      this.postService.getPostByCategory(typePost).subscribe(res => {
        if(res.status){
          this.ListPost = res.payload.data
        }
      })
    }else if(typePost == 'post-capacity'){
      let listTab = document.querySelectorAll('.post__nav-item')
      let type = document.querySelector('.capacity')

      listTab.forEach(item =>{
        item.classList.remove('active')
      })
      type?.classList.add('active')
      this.postService.getPostByCategory(typePost).subscribe(res => {
        if(res.status){
          this.ListPost = res.payload.data
        }
      })
    }else if(typePost == 'post-contest'){
      let listTab = document.querySelectorAll('.post__nav-item')
      let type = document.querySelector('.contest')

      listTab.forEach(item =>{
        item.classList.remove('active')
      })
      type?.classList.add('active')
      this.postService.getPostByCategory(typePost).subscribe(res => {
        if(res.status){
          this.ListPost = res.payload.data
        }
      })
    }
    
  }

  getListPost(){
    this.postService.getPostByCategory("post-recruitment").subscribe(res => {
       if(res.status){
        this.ListPost = res.payload.data
       }
    })
  }
  onChangeDataPost(event: any,  data: string){
    const statusAll = document.querySelectorAll('.post__nav-item');
    for (let i = 0; i < statusAll.length; i++) {
      statusAll[i]?.classList.remove('active');
    }

    event.currentTarget.classList.add('active');

    this.router.navigateByUrl(`danh-muc-bai-viet?cate=${data}`);

    this.ListPost = null
      this.postService.getPostByCategory(data).subscribe(res => {
        if(res.status){
          this.ListPost = res.payload.data
        }
      })
   
  }
 
}
