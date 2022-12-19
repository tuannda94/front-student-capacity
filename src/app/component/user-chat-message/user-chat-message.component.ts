import { User } from "src/app/models/user";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-user-chat-message",
  templateUrl: "./user-chat-message.component.html",
  styleUrls: ["./user-chat-message.component.css"],
})
export class UserChatMessageComponent implements OnInit {
  @Input() isHasNewMsg!: boolean;
  @Input() userInfo!: User;
  @Input() message!: string;
  @Input() isActive!: boolean;
  @Input() isOnline = false;

  constructor() {}

  ngOnInit(): void {}
}
