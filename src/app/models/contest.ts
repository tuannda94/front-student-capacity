import { ContestMember } from "./contest-member";
import { Enterprise } from "./enterprise.model";
import { Judges } from "./judges.model";
import { Round } from "./round.model";
import { Team } from "./team";

export class Contest {
  id: number;
  name: string;
  img: string;
  date_start: Date;
  date_end: Date;
  register_deadline: Date;
  end_register_time: Date;
  start_register_time: Date;
  description: string;
  major_id: number;
  rounds_count: number;
  status: number;
  teams: Array<Team>;
  rounds: Array<Round>;
  enterprise: Array<Enterprise>;
  judges: Array<Judges>;
  status_user_has_join_contest: boolean;
  post_new: string;
  teams_count: number;
  max_user: number;
  user_wishlist: boolean;
}
