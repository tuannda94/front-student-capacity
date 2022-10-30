import { PayingLinks } from "./paying-links";
import { User } from "./user";

export class ResponsePayload {
  id_team! : number;
  status!: boolean;
  error: string;
  user_id: [
    number
  ];
  payload!: any;
  dataContest: any;
  user_pass: Array<User>;
  user_not_pass: Array<User>;
}
