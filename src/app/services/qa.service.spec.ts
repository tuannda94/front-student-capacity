import { TestBed } from '@angular/core/testing';

import { QAService } from './qa.service';

describe('QAService', () => {
    let service: QAService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(QAService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
