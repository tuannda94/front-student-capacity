import {Round} from "./round.model";
import {Skill} from "./skill.models";
import {User} from "./user";

export class Capacity {
  id: number;
  name: string;
  img: string;
  date_start: Date;
  register_deadline: Date;
  description: string;
  major_id: number;
  status: number;
  slug_name: string;
  rounds_count: number;
  user_capacity_done_count: number;
  start_register_time: Date
  rounds: Round[];
  skills: Array<Skill>
  users: Array<User>;
}
