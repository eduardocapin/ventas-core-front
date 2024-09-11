import { TestBed } from "@angular/core/testing";
import { MotivoRechazoService } from "./motivo-rechazo.service"

describe('MotivoRechazoService', () => {
    let service: MotivoRechazoService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MotivoRechazoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});