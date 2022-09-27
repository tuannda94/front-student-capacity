import { SkillServiceService } from 'src/app/services/skill-service.service';
import { ConfigFunctionService } from 'src/app/services/config-function.service';
import { MajorService } from 'src/app/services/major.service';
import { ListPostService } from 'src/app/services/list-post.service';
import { CompanyService } from 'src/app/services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { Capacity } from 'src/app/models/capacity';
import { TestCapacityService } from 'src/app/services/test-capacity.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Major } from 'src/app/models/major';
import { Skill } from 'src/app/models/skill.models';
import { Post } from 'src/app/models/post.model';
import { TransmitToPost } from 'src/app/models/transmit-to-post.models';
import { PayingLinks } from 'src/app/models/paying-links';
import { RecruitmentsService } from 'src/app/services/recruitments.service';
import { Recruitments } from 'src/app/models/recruitments.models';
import { Enterprise } from 'src/app/models/enterprise.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-test-capacity',
  templateUrl: './test-capacity.component.html',
  styleUrls: ['./test-capacity.component.css']
})
export class TestCapacityComponent implements OnInit {
  validateForm!: FormGroup; 
  listCapacity: Array<Capacity>;
  valueSearch: string | null;
  skills: Array<Skill>;
  skill_id: number = 0;
  companys: Array<Enterprise>;
  cinfigData: TransmitToPost;
  majors: Array<Major>;

  statusCompany: boolean = false;
  statusCapacity: boolean = false;
  

  constructor(
    private testCapacityService: TestCapacityService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public companyService: CompanyService,
    public recruitmentService: RecruitmentsService,
    public listPostService: ListPostService,
    public majorService: MajorService,
    public configService: ConfigFunctionService,
    public skillService: SkillServiceService
  ) {
   }

   statusFilter: Array<any> = [
    {
      prams: true,
      name: 'Đã vào Vòng Thi',
    },
    {
      prams: false,
      name: 'Chưa vào Vòng Thi',
    },
  ];

  formFilter = new FormGroup({
    filterSkill: new FormControl(''),
    filterName: new FormControl(''),
    filterMajor: new FormControl(''),
    filterStatus: new FormControl(''),
  });

  ngOnInit(): void {
    this.valueSearch = this.route.snapshot.queryParamMap.get('q')
    let major_id= this.route.snapshot.queryParamMap.get('major_id')
    let skill_id = this.route.snapshot.queryParamMap.get('skill_id')
    
    
    if(this.valueSearch != null || major_id != null || skill_id != null){
      this.listCapacity = []
      this.statusCapacity = false
      this.testCapacityService
      .filterCapacity(this.valueSearch, major_id,  this.skill_id)
      .subscribe((res) => {
        if (res.status) {
          this.listCapacity = res.payload.data;
          this.statusCapacity = true;
          this.scrollWin();
        }
      });
    }else{
      this.getListTestCapacity()
      this.getListMajor();
      this.getAllSkill();
    }
  }

  getListTestCapacity(){
    this.testCapacityService.getAllTestCapacity().subscribe(res=>{
        if (res.status) {
          this.listCapacity = res.payload.data;
          this.listCapacity
            ? (this.statusCapacity = true)
            : this.statusCapacity;
            this.scrollWin();
        }
    })
         
    
  }
  
  // Set filter value
  setValueFilterMajor(item: Major) {
    this.formFilter.controls['filterMajor'].setValue(item.name);
  }

  // Set filter status
  setValueStatus(status: string) {
    this.formFilter.controls['filterStatus'].setValue(status);
  }

  // Set keyword recruitments
  setValueKeyword(event: any) {
    this.formFilter.controls['filterName'].setValue(event.target.value);
  }

  // Fillter comom recruitments
  filterSelect(arr: Array<any>, value: string, input: string) {
    switch (input) {
      case 'major':
        if (!value) {
          this.getListMajor();
        } else {
          this.majors = arr.filter((item) => {
            return this.configService
              .changeString(item.name)
              .includes(this.configService.changeString(value));
          });
        }
        break;

      default:
        break;
    }
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
    window.scrollTo({ top: 500, behavior: 'smooth'  });
  }


  // Filter Capacity
  filterCapacity() {
    this.listCapacity = []
    this.statusCapacity = false
    let major_id = 0;
    let keyword = '';
  
    if (this.formFilter.controls['filterName'].value) {
      keyword = this.formFilter.controls['filterName'].value;
    }

    if (this.formFilter.controls['filterMajor'].value) {
      major_id = this.majors.filter(
        (item) => item.name === this.formFilter.controls['filterMajor'].value
      )[0].id;
    }

    // đẩy param search lên URL
    this.router.navigateByUrl(`test-nang-luc?q=${keyword}&major_id=${major_id}&skill_id=${this.skill_id}`);
   
    this.testCapacityService
      .filterCapacity(keyword, major_id,  this.skill_id)
      .subscribe((res) => {
        if (res.status) {
          this.listCapacity = res.payload.data;
          this.statusCapacity = true;
          this.scrollWin();
        }
      });
  }

  filterSkill(event: any, id: number) {
    this.statusCapacity = false;
    const skills = document.querySelectorAll('.filter-skill-item');
    for (let index = 0; index < skills.length; index++) {
      const element = skills[index];
      element.classList.remove('active');
    }
    event.currentTarget.classList.add('active');
    if (id == 0) {
      this.router.navigateByUrl(`test-nang-luc`);
      this.getListTestCapacity();
    } else {
      this.skill_id = id;
      this.filterCapacity();
    }
  }

  // // Get all skill
  getAllSkill() {
    this.skillService.getAll().subscribe((res) => {
      if (res.status) {
        this.skills = res.payload;
      }
    });
  }


}
