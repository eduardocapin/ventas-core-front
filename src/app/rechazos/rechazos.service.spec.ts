import { TestBed } from "@angular/core/testing";

import { RechazosService } from "./rechazos.service";

describe('RechazosService', ()=>{
    let service: RechazosService;

    beforeEach(()=>{
        TestBed.configureTestingModule({});
        service = TestBed.inject(RechazosService);
    });

    it('should be create', ()=>{
        expect(service).toBeTruthy();
    })
});
