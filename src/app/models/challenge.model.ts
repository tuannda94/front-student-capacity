export class Challenge {
  id: number;
  name: string;
  content: string;
  type: number;
  status: number;
  successRef: number;
  sample_code: {
    code_language: CodeLang;
  }[];
  codeLangs: CodeLang[];
  tooltipLang: string;
}

export class CodeLang {
  id: number;
  ex: string;
  type: string;
  language: string;
  name: string;
}

export class SampleCode {
  id: number;
  code_run: string; // code mẫu
  code_language: CodeLang;
  code_language_id: number; // id ngôn ngữ code
}

export class TestCase {
  id: number;
  input: string;
  output: string;
  status: number; // 0 - test case ẩn
  passed: boolean; // trạng thái pass test case
  result: string;
  statusRunCode: boolean; // trạng thái đã chạy test case
  time: string; // thời gian chạy,
  flag: boolean; // trạng thái pass test case
}

export class CurrentTestCase {
  id: number;
  panel: {
    input: string;
    output: string;
    result: string;
    time: string; // thời gian chạy
  };
  isPrivate: boolean; // true => test case ẩn
}

export class ResponseTestCase {
  id: number;
  result: string;
  flag: boolean;
  time: string; // thời gian chạy;
  status: number; // trạng thái test case ẩn
}

export class ResponseSubmitCode {
  status: boolean;
  data: ResponseTestCase[];
  data_result: ResultChallenge;
}

export class ResultChallenge {
  challenge_id: number;
  user_id: number;
  code_language_id: number;
  point: number;
  flag_run_code: number; // số lần chạy code
  code_result: string;
  code_language: CodeLang;
  updated_at: string;
}
