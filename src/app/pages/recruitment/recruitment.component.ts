import { Component, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CompanyService } from 'src/app/services/company.service';
import { Enterprise } from 'src/app/models/enterprise.model';
import { RecruitmentsService } from 'src/app/services/recruitments.service';
import { Recruitments } from 'src/app/models/recruitments.models';
import { Slider } from 'src/app/models/slider.model';
import { Contest } from 'src/app/models/contest';
import { PayingLinks } from 'src/app/models/paying-links';
import { TransmitToPost } from 'src/app/models/transmit-to-post.models';
import { Skill } from 'src/app/models/skill.models';
import { ListPostService } from 'src/app/services/list-post.service';
import { Post } from 'src/app/models/post.model';
import { MajorService } from 'src/app/services/major.service';
import { Major } from 'src/app/models/major';
import { FormGroup, FormControl } from '@angular/forms';
import { ConfigFunctionService } from 'src/app/services/config-function.service';
import { SkillServiceService } from 'src/app/services/skill-service.service';
import { Title } from '@angular/platform-browser';
import { KeywordService } from 'src/app/services/keyword.service';
import { Keyword } from 'src/app/models/keyword';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recruitment',
  templateUrl: './recruitment.component.html',
  styleUrls: ['./recruitment.component.css'],
})
export class RecruitmentComponent implements OnInit {
  companys: Array<Enterprise>;
  recruitments: Array<Recruitments>;
  recruitmentsHot: Array<Recruitments> = [];
  recruitmentLinks: Array<PayingLinks>;
  cinfigData: TransmitToPost;
  listPostResult: Array<Post>;
  majors: Array<Major>  | null;
  skills: Array<Skill>;
  skill_id: any;
  major_id: any;
  keywords: Array<Keyword> | null;
  orderObj: any;
  status: any;
  keyword: string;

  // -------------
  statusPostSearch : boolean = false;
  statusPost : boolean = false;
  statusCompany: boolean = false;
  statusRecruitments: boolean = false;
  statusRecruitmentsHot: boolean = false;
  statusPage: boolean = true;
  statusSubmit: boolean = false;

  constructor(
    public dialog: MatDialog,
    public companyService: CompanyService,
    public recruitmentService: RecruitmentsService,
    public listPostService: ListPostService,
    public majorService: MajorService,
    public configService: ConfigFunctionService,
    public skillService: SkillServiceService,
    public titleService: Title,
    public keywordService: KeywordService,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
  ) {}

  statusFilter: Array<any> = [
    {
      prams: 'normal',
      name: 'Mới nhất',
    },
    {
      prams: 'hot',
      name: 'Hot nhất',
    },
  ];

  formFilter = new FormGroup({
    filterSkill: new FormControl(''),
    filterName: new FormControl(''),
    filterMajor: new FormControl(''),
    filterStatus: new FormControl(''),
  });

  ngOnInit(): void {
    this.titleService.setTitle('Tuyển dụng');
    this.route.queryParamMap.subscribe((params) => {
      this.orderObj = { ...params };
    });

    
    if (this.orderObj.params) {
      this.keyword = this.orderObj.params.keyword
        ? this.orderObj.params.keyword
        : '';
      this.major_id = this.orderObj.params.major_id
        ? this.orderObj.params.major_id
        : '';
      this.skill_id = this.orderObj.params.skill_id
        ? this.orderObj.params.skill_id
        : '';
      this.status = this.orderObj.params.status
        ? this.orderObj.params.status
        : '';

      this.filterRecruitments();
    }else{
      this.getListPost();
      this.getListRecruitment();
    }

    this.getListMajor();
    this.getAllSkill();
    this.getKeywordAll()

    

    window.addEventListener('scroll', this.noneSuggestFilter);

    const inputElement = document.querySelectorAll('.form-control');
    inputElement.forEach((item) => {
      item.addEventListener('focus', () => {
        item.nextElementSibling?.classList.remove('d-none')
      });
    });
  }

  // Set filter value
  setValueFilterMajor(item: Major) {
    this.statusSubmit = true;
    this.formFilter.controls['filterMajor'].setValue(item.name);
  }

  // Set filter status
  setValueStatus(status: string) {
    this.statusSubmit = true;
    this.formFilter.controls['filterStatus'].setValue(status);
  }

  // Set keyword recruitments
  setValueKeyword(keyword: string) {
    this.statusSubmit = true;
    this.formFilter.controls['filterName'].setValue(keyword);
  }

  // Get All keyword trending;
  getKeywordAll() {
    this.keywordService.getKeywordWhereType(1).subscribe((res) => {
      if (res.status) this.keywords = res.payload;
    });
  }


  // Check btn submit
  checkBtnSubmit(){
    if(this.formFilter.controls['filterStatus'].value ||
    this.formFilter.controls['filterName'].value  ||
    this.formFilter.controls['filterMajor'].value ){
      this.statusSubmit =  true;
    }else{
      this.statusSubmit =  false;
    }
  }

  // Fillter comom recruitments
  filterSelect(arr: Array<any> | null, value: string, input: string) {
    if (arr) {
      switch (input) {
        case 'major':
          this.checkBtnSubmit();
          if (!value) {
            this.majors = null;
            this.major_id = '';
            this.getListMajor();
          } else {
            this.majors = arr.filter((item) => {
              return this.configService
                .changeString(item.name)
                .includes(this.configService.changeString(value));
                
            });
            this.majors.length > 0 &&  this.noneSuggestFilter();
          }
          
          break;
        case 'keyword':
          this.checkBtnSubmit();
          if (!value) {
            this.keywords = null;
            this.keyword = '';
            this.getKeywordAll();
        
          } else {
            this.keywords = arr.filter((item) => {
              return this.configService
                .changeString(item.keyword)
                .includes(this.configService.changeString(value));
            });
            this.keywords.length > 0 &&  this.noneSuggestFilter();
          }
          break;
        default:
          break;
      }
    }
  }

  // Get list post
  getListPost() {
    this.listPostService
      .getPostWhereCate('post-recruitmentt')
      .subscribe((res) => {
        if (res.status) {
          this.listPostResult = res.payload.data;
          if( this.listPostResult ) this.statusPost = true;
        }
      });
  }

  getListMajor() {
    this.majorService.getAll().subscribe((res) => {
      if (res.status) {
        this.majors = res.payload;
      }
    });
  }

  // ScrollWin
  scrollWin() {
    window.scrollTo({ top: 500, behavior: 'smooth' });
  }

  // Get listRecruitment
  getListRecruitment() {
    this.recruitments = [];
    this.recruitmentService.getAllRecruitment().subscribe((res) => {
      if (res.status) {
        this.recruitments = res.payload;
        this.recruitments
          ? (this.statusRecruitments = true)
          : this.statusRecruitments;
        this.statusPage = false;
        this.scrollWin();
      }
    });
  }

  // get skill limit
  getLimitSkill(arrSkill: Array<Skill>): Array<Skill> {
    let arrResult = arrSkill.filter((res, index) => {
      return index < 3;
    });
    return arrResult;
  }

  // Filter recruitments
  filterRecruitments() {
    this.statusRecruitments = false;
    this.statusPost = false;

    if (this.formFilter.controls['filterName'].value) {
      this.keyword = this.formFilter.controls['filterName'].value;
    }

    if (this.formFilter.controls['filterMajor'].value && this.majors) {
      this.major_id = this.majors.filter(
        (item) => item.name === this.formFilter.controls['filterMajor'].value
      )[0].id;
    }

    if (this.formFilter.controls['filterStatus'].value) {
      this.status = this.statusFilter.filter(
        (item) => item.name === this.formFilter.controls['filterStatus'].value
      )[0].prams;
    }


    if (this.status  || this.keyword || this.major_id || this.skill_id) {
      this.router.navigate(['/tuyen-dung'], {
        queryParams: {
          status: this.status,
          keyword: this.keyword,
          major_id: this.major_id,
          skill_id: this.skill_id,
        },
        queryParamsHandling: 'merge',
      });
    }

    this.listPostService.searchPostRecruitment(this.keyword).subscribe(res => {
      if(res.status && res.payload.data.length > 0 ){      
        this.statusPostSearch = true;
        this.listPostResult = res.payload.data;
        this.statusPost = true;
      }else{
        this.getListPost();
      }
    })

    this.recruitmentService
      .filterRecruitment(
        this.keyword,
        this.major_id,
        this.status,
        this.skill_id
      )
      .subscribe((res) => {
        if (res.status) {
          this.statusRecruitments = true;
          this.recruitments = res.payload;
          this.scrollWin();
        }
      });
  }

  filterSkill(event: any, id: number) {
    this.statusRecruitments = false;
    const skills = document.querySelectorAll('.filter-skill-item');
    for (let index = 0; index < skills.length; index++) {
      const element = skills[index];
      element.classList.remove('active');
    }
    event.currentTarget.classList.add('active');
    if (id == 0) {
      this.getListRecruitment();
      this.resetFilter();
    } else {
      this.skill_id = id;
      this.filterRecruitments();
    }
  }

  // Get all skill
  getAllSkill() {
    this.skillService.getAll().subscribe((res) => {
      if (res.status) {
        this.skills = res.payload.filter((item: Skill, index: number) => {
          return index < 10;
        });
      }
    });
  }


  // Cập nhất tất cả trạng thái về more
  resetFilter() {
    this.formFilter.controls['filterMajor'].setValue('');
    this.formFilter.controls['filterStatus'].setValue('');
    this.formFilter.controls['filterName'].setValue('');
    this.keyword = '';
    this.major_id = '';
    this.skill_id = '';
    this.status = '';
    this.location.replaceState('');
  }

  // Ẩn gợi ý khi seach ko ra kết quả
  noneSuggestFilter(){
    const keywordSugg = document.querySelectorAll(
      '.input__search-keyword--sugg'
    );
    keywordSugg.forEach((item) => {
      item.classList.add('d-none');
    });
  }


  getAllPost(){
    let keyword = '';
    if(this.statusPostSearch){
      keyword =  this.keyword;
    }else{
      keyword =  '';
    }

    this.router.navigate(['/tim-kiem/bai-viet'], {
      queryParams: {
        keyword :  keyword,
      },
      queryParamsHandling: 'merge',
    });
  }
  
  
}
