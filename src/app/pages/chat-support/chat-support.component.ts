import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ChatSupportService } from "src/app/services/chat-support.service";

@Component({
  selector: "app-chat-support",
  templateUrl: "./chat-support.component.html",
  styleUrls: ["./chat-support.component.css"],
})
export class ChatSupportComponent implements OnInit {
  // fake user
  users = [
    {
      id: 1,
      name: "Tuân Oke",
      avatar: "https://picsum.photos/200/200",
      email: "tuanoke@gmail.com",
    },
    {
      id: 2,
      name: "Quảng Oke",
      avatar: "https://picsum.photos/200/200",
      email: "quangoke@gmail.com",
    },
    {
      id: 3,
      name: "Trọng Oke",
      avatar: "https://picsum.photos/200/200",
      email: "trôngke@gmail.com",
    },
  ];

  constructor(private titleService: Title, private chatSPService: ChatSupportService) {}

  ngOnInit(): void {
    this.titleService.setTitle("Hỗ trợ trực tuyến");
  }
}
