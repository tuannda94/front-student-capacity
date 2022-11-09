import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Enterprise } from 'src/app/models/enterprise.model';
import { Major } from 'src/app/models/major';
import { PayingLinks } from 'src/app/models/paying-links';
import { Post } from 'src/app/models/post.model';
import { Recruitments } from 'src/app/models/recruitments.models';
import { Skill } from 'src/app/models/skill.models';
import { TransmitToPost } from 'src/app/models/transmit-to-post.models';
import { CompanyService } from 'src/app/services/company.service';
import { ConfigFunctionService } from 'src/app/services/config-function.service';
import { ListPostService } from 'src/app/services/list-post.service';
import { MajorService } from 'src/app/services/major.service';
import { RecruitmentsService } from 'src/app/services/recruitments.service';
import { SkillServiceService } from 'src/app/services/skill-service.service';

@Component({
  selector: 'app-post-result-search',
  templateUrl: './post-result-search.component.html',
  styleUrls: ['./post-result-search.component.css'],
})
export class PostResultSearchComponent implements OnInit {
  results: Post[] | null;
  validateForm!: FormGroup;
  inputKeyword: string;
  keywordQuery: any;
  // Filter Bien
  companys: Array<Enterprise>;
  recruitments: Array<Recruitments>;
  recruitmentsHot: Array<Recruitments> = [];
  recruitmentLinks: Array<PayingLinks>;
  cinfigData: TransmitToPost;
  listPostResult: Array<Post>;
  valueSelectPost: string = '';
  // -------------
  statusResultPost: boolean = false;
  statusPostFilter: boolean = false;
  statusPostHot: boolean = false;
  statusSubmit: boolean = false;
  statusNotResultReturn: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private postService: ListPostService,
    public dialog: MatDialog,
    public companyService: CompanyService,
    public recruitmentService: RecruitmentsService,
    public listPostService: ListPostService,
    public majorService: MajorService,
    public configService: ConfigFunctionService,
    public skillService: SkillServiceService
  ) {}

  typePosts: Array<any> = [
    {
      param: 'post-contest',
      name: 'Bài Viết Thuộc Cuộc Thi',
    },
    {
      param: 'post-capacity',
      name: 'Bài Viết Thuộc Test Năng Lực',
    },
    {
      param: 'post-round',
      name: 'Bài Viết Thuộc Vòng Thi',
    },
    {
      param: 'post-recruitment',
      name: 'Bài Viết Thuộc Tuyển Dụng',
    },
  ];

  statusHotPosts: Array<any> = [
    {
      param: 'normal',
      name: 'Mới nhất',
    },
    {
      param: 'hot',
      name: 'Hot nhất',
    },
  ];

  formFilter = new FormGroup({
    filterName: new FormControl(''),
    filterTypePost: new FormControl(''),
    filterStatus: new FormControl(''),
  });

  ngOnInit(): void {
    this.backTop();
    if (
      this.formFilter.controls['filterTypePost'].value ||
      this.formFilter.controls['filterStatus'].value ||
      this.formFilter.controls['filterName'].value
    ) {
      this.statusSubmit = true;
    } else {
      this.statusSubmit = false;
    }

    // set value on param into input value
    this.keywordQuery = this.route.snapshot.queryParamMap.get('keyword');
    let typePost: any = '';
    let statusHotPost: any = '';
    this.inputKeyword = this.keywordQuery;

    typePost = this.typePosts.filter((item) => {
      return item.param == this.route.snapshot.queryParamMap.get('post');
    });
    statusHotPost = this.statusHotPosts.filter((item) => {
      return item.param == this.route.snapshot.queryParamMap.get('postHot');
    });

    this.formFilter.controls['filterName'].setValue(this.keywordQuery);

    if (typePost.length > 0)
      this.formFilter.controls['filterTypePost'].setValue(typePost[0].name);
    if (statusHotPost.length > 0)
      this.formFilter.controls['filterTypePost'].setValue(
        statusHotPost[0].name
      );

    // check nếu có 1 trong 3 dữ liệu thì chạy search
    if (
      this.keywordQuery != null ||
      typePost != null ||
      statusHotPost != null
    ) {
      this.results = [];
      this.statusResultPost = false;
      this.listPostService
        .filterPost(this.keywordQuery, typePost, statusHotPost)
        .subscribe((res) => {
          if (res.status) {
            if (res.payload.data.length <= 0) {
              this.statusResultPost = true;
              this.statusNotResultReturn = true;
            } else {
              this.statusResultPost = true;
              this.results = res.payload.data;
            }
          }
        });
    } else {
      this.getListPost();
    }
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

  getListPost() {
    this.postService.getAllListPost().subscribe((res) => {
      if (res.status) {
        this.results = res.payload.data;
        this.results ? (this.statusResultPost = true) : this.statusResultPost;
      }
    });
  }

  // ---------------------- filter ----------------------
  // Set filter value major
  setValueFilterPost(item: Major) {
    this.formFilter.controls['filterTypePost'].setValue(item.name);
    this.statusPostFilter = true;
    this.statusSubmit = true;
  }

  // Set filter status hot post
  setValueStatus(status: string) {
    this.formFilter.controls['filterStatus'].setValue(status);
    this.statusPostHot = true;
    this.statusSubmit = true;
  }

  // Set keyword recruitment
  setValueKeyword(event: any) {
    this.formFilter.controls['filterName'].setValue(event.target.value);
    if (event.target.value == '') {
      this.statusSubmit = false;
      if (this.statusPostFilter || this.statusPostHot) {
        this.statusSubmit = true;
      }
    } else {
      this.formFilter.controls['filterName'].setValue(event.target.value);
      this.statusSubmit = true;
    }
  }

  // Filter recruitments
  filterRecruitments() {
    this.results = [];
    this.statusNotResultReturn = false;
    this.statusResultPost = false;
    this.keywordQuery = this.route.snapshot.queryParamMap.get('keyword');
    let typePost = '';
    let status = '';
    let keyword = '';

    if (this.formFilter.controls['filterName'].value) {
      keyword = this.formFilter.controls['filterName'].value;
    }

    if (this.formFilter.controls['filterTypePost'].value) {
      typePost = this.typePosts.filter(
        (item) => item.name === this.formFilter.controls['filterTypePost'].value
      )[0].param;
    }

    if (this.formFilter.controls['filterStatus'].value) {
      status = this.statusHotPosts.filter(
        (item) => item.name === this.formFilter.controls['filterStatus'].value
      )[0].param;
    }

    this.router.navigateByUrl(
      `/tim-kiem/bai-viet?keyword=${keyword}&post=${typePost}&postHot=${status}`
    );

    this.listPostService
      .filterPost(keyword, typePost, status)
      .subscribe((res) => {
        if (res.status) {
          if (res.payload.data.length <= 0) {
            this.statusResultPost = true;
            this.statusNotResultReturn = true;
          } else {
            this.results = res.payload.data;
            this.statusResultPost = true;
            this.statusNotResultReturn = false;
          }
        }
      });
  }
}
