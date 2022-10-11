import { Router } from "@angular/router";
import { Component, Input, OnInit } from "@angular/core";
import { Capacity } from "src/app/models/capacity";

@Component({
  selector: "app-capacity-related-item",
  templateUrl: "./capacity-related-item.component.html",
  styleUrls: ["./capacity-related-item.component.css"],
})
export class CapacityRelatedItemComponent implements OnInit {
  @Input() capacityItem!: Capacity;

  countDown: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };
  timerId!: any;
  statusExam!: {
    status: number;
    statustext: string;
  };
  skillsName!: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const listSkill = this.capacityItem.skills.map((skill) => skill.short_name);
    this.skillsName = listSkill.length ? listSkill.join(", ") : "Không có!";

    // trạng thái bài test
    this.getStatusCapacity();

    // nếu bài test sắp diễn ra ? đếm ngược thời gian bắt đầu mở bài test
    if (this.statusExam.status !== 0) return;
    this.timerId = setInterval(() => {
      let futureDate = new Date(this.capacityItem.date_start).getTime();

      let today = new Date().getTime();
      let distance = futureDate - today;

      if (distance < 0) {
        this.countDown.days = 0;
        this.countDown.hours = 0;
        this.countDown.minutes = 0;
        this.countDown.seconds = 0;
        this.statusExam = {
          status: 1,
          statustext: "Đang diễn ra",
        };
        clearInterval(this.timerId);
      } else {
        this.countDown.days = Math.floor(distance / (1000 * 60 * 60 * 24));
        this.countDown.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.countDown.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        this.countDown.seconds = Math.floor((distance % (1000 * 60)) / 1000);
      }
    }, 1000);
  }

  handleGoToExam(capacity_id: number) {
    if (this.statusExam.status === 2) return;

    this.router.navigate(["/test-nang-luc", capacity_id]);
  }

  // get trạng thái bài test
  getStatusCapacity() {
    const today = new Date().getTime();
    const timeDateStart = new Date(this.capacityItem.date_start).getTime();
    const timeDateEnd = new Date(this.capacityItem.register_deadline).getTime();

    if (today < timeDateStart) {
      this.statusExam = {
        status: 0,
        statustext: "Sắp diễn ra",
      };
    } else if (today >= timeDateStart && today <= timeDateEnd) {
      this.statusExam = {
        status: 1,
        statustext: "Đang diễn ra",
      };
    } else if (today > timeDateEnd) {
      this.statusExam = {
        status: 2,
        statustext: "Đã kết thúc",
      };
    }
  }
}
