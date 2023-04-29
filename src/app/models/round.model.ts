import {Contest} from './contest';
import {Judges} from "./judges.model";
import {Team} from "./team";

export class Round {
  id: number;
  name: string;
  image: string;
  description: string;
  end_time: Date;
  time_exam: number;
  time_type_exam: number;
  contest_id: number;
  max_questions_exam: number;
  type_exam_id: number;
  start_time: Date;
  teams: Array<Team>;
  judges: Array<Judges>;
  contest: Contest
}
