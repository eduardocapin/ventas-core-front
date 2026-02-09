import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportadorDocumentosGeneralComponent } from './importador-documentos-general.component';
import { ImportadorDocumentosService } from '../importador-documentos.service';
import { SharedModule } from '../../core/shared/shared.module';
import { of } from 'rxjs';

describe('ImportadorDocumentosGeneralComponent', () => {
  let component: ImportadorDocumentosGeneralComponent;
  let fixture: ComponentFixture<ImportadorDocumentosGeneralComponent>;
  let service: jasmine.SpyObj<ImportadorDocumentosService>;

  beforeEach(async () => {
    service = jasmine.createSpyObj('ImportadorDocumentosService', ['getDocumentos']);
    service.getDocumentos.and.returnValue(of({ items: [], totalItems: 0 }));

    await TestBed.configureTestingModule({
      declarations: [ImportadorDocumentosGeneralComponent],
      imports: [SharedModule],
      providers: [{ provide: ImportadorDocumentosService, useValue: service }],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportadorDocumentosGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
