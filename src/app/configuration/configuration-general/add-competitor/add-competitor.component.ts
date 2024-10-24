import { Component, Inject, Renderer2 } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ICompetidor } from 'src/app/models/competidor.model';
import { FilterService } from 'src/app/services/filter/filter.service';
import { CompetidoresService } from 'src/app/services/competitors/competidores.service';
import { timeout } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-add-competitor',
  templateUrl: './add-competitor.component.html',
  styleUrls: ['./add-competitor.component.scss'],
})
export class AddCompetitorComponent {
  competitorList: ICompetidor[] = [];
  filteredCompetitorList: ICompetidor[] = [];
  cargando: boolean = false;

  newCompetitonName: string = '';
  newSegmentation_value_id: number = 0;
  editingCompetitorId: number | null = null;
  originalCompetitor: ICompetidor | null = null;
  familyList: { id: number; name: string; selected: boolean }[] = [];
  filteredFamilyList: { id: number; name: string; selected: boolean }[] = [];

  // Declaramos un mapa para almacenar las familias seleccionadas por competidor
  selectedFamiliesMap: {
    [competitorId: number]: { [familyId: number]: boolean };
  } = {};
  allFamiliesSelected: boolean = false;
  isSomeSelected: boolean = false;
  selectedCompetitor: ICompetidor | null = null;
  previousSelectedFamilies: { id: number; selected: boolean }[] = [];

  searchTermCompetitor: string = '';
  searchTermFamily: string = '';

  // Variable para manejar si el texto está truncado
  isTooltipVisible: boolean = false;
  tooltipText: string | null = null;

  constructor(
    private renderer: Renderer2,
    private competitorsService: CompetidoresService,
    private filterService: FilterService,
    public dialogRef: MatDialogRef<AddCompetitorComponent>,
    public dialog: MatDialog,
    private _notifactionService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: { autoClose: boolean }
  ) {}

  ngOnInit(): void {
    this.cargarCompetitors();
    this.cargarFamilias();
  }
  /* cargar los datos */
  cargarCompetitors(): void {
    this.cargando = true;
    this.competitorsService
      .getCompetidores()
      .pipe(timeout(20000))
      .subscribe(
        (data: ICompetidor[]) => {
          console.log('Datos de competidores recibidos:', data);
          this.competitorList = data;
          this.cargando = false;
          console.log(this.competitorList);
          this.filteredCompetitorList = this.competitorList;
          this.initializeSelectedFamilies();
        },
        (error) => {
          console.error('Error al cargar los competidores', error);
          this.cargando = false;
        }
      );
  }

  cargarFamilias(): void {
    this.filterService
      .getFilterOptions('segmentacion-productos/1')
      .subscribe((families: { id: number; name: string }[]) => {
        this.familyList = families.map((family) => ({
          ...family,
          selected: false,
        }));
        this.filteredFamilyList = [...this.familyList];
      });
  }

  initializeSelectedFamilies(): void {
    this.competitorList.forEach((competitor) => {
      const segmentationValueId = competitor.segmentation_value_ids;
      this.selectedFamiliesMap[competitor.id!] = {};

      if (segmentationValueId === '-1') {
        // Si el valor es -1, marcar todas las familias como seleccionadas
        this.familyList.forEach((family) => {
          this.selectedFamiliesMap[competitor.id!][family.id] = true;
        });
      } else {
        const familyIds = segmentationValueId
          .split(',')
          .map((id) => parseInt(id.trim(), 10));
        familyIds.forEach((familyId) => {
          this.selectedFamiliesMap[competitor.id!][familyId] = true;
        });
      }
    });
  }
  insertCompetitor() {
    if (this.newCompetitonName) {
      const newCompetitor = {
        name: this.newCompetitonName,
        segmentation_value_ids: '',
      };
      this.competitorsService.insertCompetitor(newCompetitor, [-1]).subscribe(
        (data) => {
          if (data.status === 'Success') {
            this._notifactionService.showSuccess(
              'Competidor añadido con exito'
            );
            this.cargarCompetitors();
            this.clearNewCompetitor();
            if (this.data.autoClose) {
              this.dialogRef.close({
                id: data.competidorId,
                name: newCompetitor.name,
              });
            }
          }
        },
        (error) => {
          console.error('Error al añadir el competidor', error);
          this._notifactionService.showError('Error al añadir el competidor');
        }
      );
    } else {
      /// aqui mostramos el error
      this._notifactionService.showError(
        'Por favor complete todos los campos.'
      );
    }
  }

  toggleEdit(competitorId: number) {
    const competitor = this.competitorList.find((c) => c.id === competitorId);
    if (competitor) {
      this.originalCompetitor = { ...competitor };
      this.editingCompetitorId = competitorId;
    }
  }

  saveChanges(competitor: ICompetidor) {
    if (competitor.name) {
      this.competitorsService.updateCompetitors(competitor).subscribe(
        (status) => {
          if (status === 'Success') {
            this._notifactionService.showSuccess(
              'Competidor actualizado con éxito'
            );
            this.cargarCompetitors();
            this.editingCompetitorId = null;
            this.originalCompetitor = null;
          }
        },
        (error) => {
          console.error('Error al actualizar el competidor', error);
          this._notifactionService.showError(
            'Error al actualizar al competidor'
          );
          this.cancelEdit();
        }
      );
    } else {
      this._notifactionService.showError(
        'Por favor complete todos los campos.'
      );
    }
  }

  updateSgmentatios(competitor_id: number) {
    const selectedFamiliesForCompetitor: { [key: string]: boolean } =
      this.selectedFamiliesMap[competitor_id] || {};
    let selectedFamilyIds = Object.keys(selectedFamiliesForCompetitor)
      .filter((familyId: string) => selectedFamiliesForCompetitor[familyId])
      .map((familyId) => parseInt(familyId, 10));
    if (selectedFamilyIds.length === this.familyList.length) {
      selectedFamilyIds = [-1];
    }
    console.log('IDs seleccionadas:', selectedFamilyIds);

    this.competitorsService
      .updateCompetitorsSegmentations(competitor_id, selectedFamilyIds)
      .subscribe(
        (status) => {
          if (status === 'Success') {
            this._notifactionService.showSuccess(
              'Competidor actualizado con éxito'
            );
            this.cargarCompetitors();
          }
        },
        (error) => {
          console.error('Error al actualizar el competidor', error);
          this._notifactionService.showError(
            'Error al actualizar al competidor'
          );
        }
      );
  }

  cancelEdit() {
    if (this.originalCompetitor) {
      const index = this.competitorList.findIndex(
        (c) => c.id === this.originalCompetitor!.id
      );
      if (index !== -1) {
        this.competitorList[index] = { ...this.originalCompetitor };
      }
    }
    this.editingCompetitorId = null;
    this.originalCompetitor = null;
  }

  /* limpiar el input */
  clearNewCompetitor() {
    this.newCompetitonName = '';
  }

  deleteCompetidor(id: Number) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: `¿Estas seguro de eliminar este competidor?`,
      })
      .afterClosed()
      .subscribe((confirmado: boolean) => {
        if (confirmado) {
          this.competitorsService.deleteCompetitor(id).subscribe((data) => {
            if (data === 'Success') {
              this.cargarCompetitors();
              this.mensajeExito();
            }
          });
        }
      });
  }

  /* mesanje de exito */
  mensajeExito() {
    this._notifactionService.showSuccess('Competidor eliminado correctamente');
  }

  getFamilyName(familyId: number): string {
    const family = this.familyList.find((f) => f.id === familyId);
    return family ? family.name : 'Todas';
  }

  /* lógica de botón de Cancelar de Motivo de Rechazo */
  cerrarPopup() {
    this.dialogRef.close();
  }
  isButtonEnabled(): boolean {
    return (
      this.newCompetitonName.trim() !== '' &&
      this.newSegmentation_value_id !== -1
    );
  }

  onSearchCompetitor(term: string): void {
    this.searchTermCompetitor = term;
    this.filterCompetitors();
  }

  filterCompetitors(): void {
    this.filteredCompetitorList = this.competitorList.filter((competitor) =>
      competitor.name
        .toLowerCase()
        .includes(this.searchTermCompetitor.toLowerCase())
    );
  }

  onSearchFamily(term: string): void {
    this.logPreviousSelectedFamilies();
    this.searchTermFamily = term;
    this.filteredFamilyList = this.familyList.filter((family) =>
      family.name.toLowerCase().includes(term.toLowerCase())
    );
    this.loadSelectedFamilies(this.selectedCompetitor!);
    this.sortSelectedFamilies();
    this.updateHeaderCheckboxState();
  }

  selectCompetitor(competitor: ICompetidor): void {
    if (this.editingCompetitorId !== null) {
      return;
  }
    if (this.selectedCompetitor) {
      this.logPreviousSelectedFamilies();
      //REALIZAR EL UPDATE DE LA SELECCION???
      this.updateSgmentatios(this.selectedCompetitor.id!);
      console.log('update');
    }
    this.selectedCompetitor = competitor;
    this.loadSelectedFamilies(competitor);
    this.sortSelectedFamilies();
  }

  logPreviousSelectedFamilies(): void {
    if (this.selectedCompetitor) {
      const selectedFamiliesForCompetitor =
        this.selectedFamiliesMap[this.selectedCompetitor.id!] || {};
      this.filteredFamilyList.forEach((family, index) => {
        selectedFamiliesForCompetitor[family.id] =
          this.filteredFamilyList[index].selected || false;
      });
      this.selectedFamiliesMap[this.selectedCompetitor.id!] =
        selectedFamiliesForCompetitor;
    }
  }

  loadSelectedFamilies(competitor: ICompetidor): void {
    const selectedFamiliesForCompetitor =
      this.selectedFamiliesMap[competitor.id!] || {};
    this.filteredFamilyList.forEach((family) => {
      family.selected = !!selectedFamiliesForCompetitor[family.id];
    });
    this.updateSelectAllCheckbox();
  }

  sortSelectedFamilies(): void {
    this.filteredFamilyList.sort((a, b) => {
      const aSelected = a.selected ? 1 : 0;
      const bSelected = b.selected ? 1 : 0;
      return bSelected - aSelected;
    });
  }

  toggleFamilySelection(familyId: number): void {
    const family = this.filteredFamilyList.find((f) => f.id === familyId);
    if (family) {
      family.selected = !family.selected;
      this.updateSelectAllCheckbox();
    }
  }
  toggleFamilySelectionCheckbox(familyId: number, isSelected: boolean) {
    const family = this.filteredFamilyList.find((f) => f.id === familyId);
    if (family) {
      family.selected = isSelected;
      this.updateSelectAllCheckbox();
    }
  }

  toggleSelectAll(event: any): void {
    const isChecked = event.target.checked;
    this.filteredFamilyList.forEach((family) => {
      family.selected = isChecked;
    });
    this.allFamiliesSelected = isChecked;
    this.updateHeaderCheckboxState();
  }

  updateHeaderCheckboxState(): void {
    const allSelected = this.filteredFamilyList.every(
      (family) => family.selected
    );
    const someSelected = this.filteredFamilyList.some(
      (family) => family.selected
    );

    this.allFamiliesSelected = allSelected;
    this.isSomeSelected = someSelected && !allSelected;
  }

  updateSelectAllCheckbox(): void {
    const totalFamilies = this.filteredFamilyList.length;
    const selectedCount = this.filteredFamilyList.filter(
      (family) => family.selected
    ).length;

    this.allFamiliesSelected = selectedCount === totalFamilies;
  }
  applyTooltipIfTruncated(event: Event, text: string) {
    const element = event.target as HTMLElement;
    this.isTooltipVisible = this.isTextTruncated(element);

    // Solo asigna el texto del tooltip si el texto está truncado
    if (this.isTooltipVisible) {
      this.tooltipText = text;
      this.renderer.setStyle(element, 'cursor', 'pointer'); // Añade el cursor tipo pointer
    } else {
      this.tooltipText = null;
      this.renderer.removeStyle(element, 'cursor'); // Remueve el cursor tipo pointer
    }
  }
  /* logica para que aparezca tooltip cuando el texto es muy grande */
  isTextTruncated(element: HTMLElement): boolean {
    return element.offsetWidth < element.scrollWidth;
  }
}
