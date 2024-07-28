import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { QAService } from "src/app/services/qa.service";

@Component({
    selector: "app-question-and-answer",
    templateUrl: "./question-and-answer.component.html",
    styleUrls: [
        "./question-and-answer.component.css",
    ],
})


export class QuestionAndAnswerComponent implements OnInit {
    internship: Array<any> = [];
    job: Array<any> = [];
    event: Array<any> = [];
    items: any[] = [
        {
            id: 1,
            name: 'Thực tập',
        },
        {
            id: 2,
            name: 'Việc làm',
        },
        {
            id: 3,
            name: 'Sự kiện',
        }
    ];

    constructor(
        private titleService: Title,
        private qaService: QAService,
        private router: Router
    ) { }

    ngOnInit() {
        this.titleService.setTitle("Hỏi đáp");

        this.qaService.getQAInternship().subscribe(res => {
            if (res.status) {
                this.internship = res.payload.data;
            }
        });
        this.qaService.getQAJob().subscribe(res => {
            if (res.status) {
                this.job = res.payload.data;
            }
        });
        this.qaService.getQAEvent().subscribe(res => {
            if (res.status) {
                this.event = res.payload.data;
            }
        });
    }

    seeDetail(id: any) {
        this.router.navigate([`/hoi-dap/${id}`])
    }
}
