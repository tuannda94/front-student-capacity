import { PayingLinks } from "./paying-links";
import { User } from "./user";

export class ResponsePayload {
  // id_team(id_team: any) {
  //   throw new Error('Method not implemented.');
  // }
  id_team! : number;
  status!: boolean;
  user_id: [
    number
  ];
  payload!: any;
  dataContest: any;
  user_pass: Array<User>;
  user_not_pass: Array<User>;
}
