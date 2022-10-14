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
}
