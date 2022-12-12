import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ChatSupportService } from "src/app/services/chat-support.service";

@Component({
  selector: "app-chat-support",
  templateUrl: "./chat-support.component.html",
  styleUrls: ["./chat-support.component.css"],
})
export class ChatSupportComponent implements OnInit {
  constructor(private titleService: Title, private chatSPService: ChatSupportService) {}

  ngOnInit(): void {
    this.titleService.setTitle("Hỗ trợ trực tuyến");
  }
}
