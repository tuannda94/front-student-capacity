import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { map, switchMap } from 'rxjs';
import { ModalDownRateComponent } from 'src/app/modal/modal-down-rate/modal-down-rate.component';
import { QA } from 'src/app/models/qa.model';
import { QAService } from 'src/app/services/qa.service';

@Component({
  selector: 'app-detail-faq',
  templateUrl: './detail-faq.component.html',
  styleUrls: ['./detail-faq.component.css']
})
export class DetailFaqComponent implements OnInit {
  id: number;
  faq: QA;
  relatedFaqs: any [];
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private qaService: QAService,
    public dialog: MatDialog,
    private toastService: NgToastService
  ) {
    console.log(this.route.snapshot.params['id'])
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get("id")),
        switchMap((id) => this.qaService.getQADetail(id)),
      ).subscribe((res) => {
        if (res.status) {
          this.faq = res.payload;
        }
      })
    this.route.paramMap
      .pipe(
        map((params) => params.get("id")),
        switchMap((id) => this.qaService.getRelated(id)),
      ).subscribe(res => {
        if (res.status) {
          this.relatedFaqs = res.payload.data;
        }
      })
  }

  upRate() {
    this.qaService.rating(this.route.snapshot.params['id'], {
      "type": 1,
      "content": "",
    }).subscribe((res: any) => {
      if (!res.status) {
        // Nếu không có cấu trúc lỗi cụ thể, hiển thị thông báo lỗi chung
        this.toastService.warning({ 
          summary: 'Đã xảy ra lỗi', 
          duration: 2000, 
          detail: "Cảnh báo" 
        });
      } else {
        this.toastService.success({ 
          summary: `${res.payload}`, 
          duration: 2000, 
          detail: "Thành Công" 
        });
      }
    })
  }

  openModal() {
    const dialogRef = this.dialog.open(ModalDownRateComponent, {
      width: "700px",
      data: {
        id: this.route.snapshot.params['id'],
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result", result);
    });
  }
}
