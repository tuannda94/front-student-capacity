import { ActivatedRoute, Router } from '@angular/router';
import { CapacityService } from './../../services/capacity.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Capacity } from 'src/app/models/capacity';
import { map, switchMap } from 'rxjs';
import * as moment from 'moment';
import { Round } from 'src/app/models/round.model';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-capacity-detail',
  templateUrl: './capacity-detail.component.html',
  styleUrls: ['./capacity-detail.component.css']
})
export class CapacityDetailComponent implements OnInit {

  tabActive!: string;
  capacity!: Capacity;
  // bài test liên quan
  capacityRelated!: any[];
  isFetchingCapacity = false;
  rounds!: Round[];
  countDown: {
    days: number,
    hours: number,
    minutes: number,
    seconds: number
  } = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  statusExam!: {
    status: number,
    statustext: string
  };

  constructor(
    private modalService: NgbModal,
    private capacityService: CapacityService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: NgToastService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.isFetchingCapacity = true;
      this.scrollToTop();

      const { capacity_id } = params;

      this.capacityService.getWhereId(capacity_id).subscribe(res => {
        if (res.status) {
          this.capacity = res.payload;
          this.rounds = res.payload.rounds;

          // bài test liên quan
          this.capacityService.getRelated(this.capacity.id).subscribe(response => {
            this.isFetchingCapacity = false;

            if (response.status) {
              this.capacityRelated = response.payload.data.slice(0, 3);
            }
          })

          // đếm ngược thời gian khi bài test sắp diễn ra
          const status = new Date().getTime() < new Date(this.capacity.date_start).getTime();
          status && this.countDownTimer();

          // get trạng thái bài test
          this.getStatusCapacity();
        }
      })
    })
  }

  openModalDesc(content: Object) {
    this.modalService.open(content, { scrollable: true })
  }

  scrollToElement(el: HTMLElement, activeItem: string) {
    this.tabActive = activeItem;

    let offsetTop = el.offsetTop;
    if (activeItem === 'testRelated') {
      offsetTop -= 150;
    }

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
  }

  // get trạng thái bài test
  getStatusCapacity() {
    const today = new Date().getTime();
    const timeDateStart = new Date(this.capacity.date_start).getTime();
    const timeDateEnd = new Date(this.capacity.register_deadline).getTime();

    if (today < timeDateStart) {
      this.statusExam = {
        status: 0,
        statustext: "Sắp diễn ra"
      }
    } else if (today >= timeDateStart && today <= timeDateEnd ) {
      this.statusExam = {
        status: 1,
        statustext: "Đang diễn ra"
      }
    } else if (today > timeDateEnd) {
      this.statusExam = {
        status: 2,
        statustext: "Đã kết thúc"
      }
    }
  }

  // đếm ngược thời gian
  countDownTimer() {
    let timerId: any;

    timerId = setInterval(() => {
      let futureDate = new Date(this.capacity.date_start).getTime();

      let today = new Date().getTime();
      let distance = futureDate - today;
      if (distance < 0) {
        this.countDown.days = 0;
        this.countDown.hours = 0;
        this.countDown.minutes = 0;
        this.countDown.seconds = 0;
        this.statusExam = {
          status: 1,
          statustext: "Đang diễn ra"
        }
        clearInterval(timerId);

      } else {
        this.countDown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.countDown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.countDown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.countDown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      }
    }, 1000);
  }

  // vào bài thi đầu tiên
  handleGoToFirstTest() {
    console.log(this.rounds);
    if (this.statusExam.status === 1) {
      if (!this.rounds.length) {
        this.toast.warning({ summary: "Chưa có bài thi nào", duration: 3000 });
        return;
      }

      this.router.navigate(['/test-nang-luc/vao-thi', this.capacity.id, 'bai-thi', this.rounds[0].id]);
    }
  }

  // scroll top
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
