
class QAItem {
    question: string;
    answer: string;
}

export class QA {
    id?: any;
    question: string;
    answer: string;
    category: string;
    listItems: QAItem[];
}
