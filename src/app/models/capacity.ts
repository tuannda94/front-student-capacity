import { ExamCapacity } from "./exam.model";
import { CapacityRound, Round } from "./round.model";
import { Skill } from "./skill.models";
import { User } from "./user";

export class Capacity {
  id: number;
  name: string;
  img: string;
  user_capacity_done: Array<User> = [];
  date_start: Date;
  register_deadline: Date;
  description: string;
  major_id: number;
  status: number;
  slug_name: string;
  start_register_time: Date;
  rounds: Round[];
  skills: Skill[];
  rounds_count: number;
  user_capacity_done_count: number;
  user_top: null | {
    user: User
  }
}

class ResultExam {
  id: number;
  scores: number;
  donot_answer: number;
  false_answer: number;
  true_answer: number;
  created_at: Date;
  updated_at: Date;
}

export class ResponseSubmitExam {
  status: boolean;
  payload: ResultExam;
}

export class DataExam {
  exam_id: number;
  data: {
    questionId: number;
    answerIds?: string[];
    type: number;
    answerId?: number;
  }[];
}

// kết quả check trạng thái làm bài
export class ResponseCheckSttExam {
  status: boolean;
  payload: number;
  message: string;
  result: ResultExam;
}

// lịch sử làm bài
export class ResponseCapacityHistory {
  status: boolean;
  payload: ResultExam;
  exam: ExamCapacity;
}

export class CapacityExamHistory {
  capacity: Capacity;
  round: CapacityRound;
  exam: ExamCapacity;
}
