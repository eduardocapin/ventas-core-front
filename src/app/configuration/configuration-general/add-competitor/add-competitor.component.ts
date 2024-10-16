import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICompetidor } from 'src/app/models/competidor.model';
import { FilterService } from 'src/app/services/filter/filter.service';
import { CompetidoresService } from 'src/app/services/competitors/competidores.service';
import { timeout } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from 'src/app/services/notification/notification.service';


@Component({
  selector: 'app-add-competitor',
  templateUrl: './add-competitor.component.html',
  styleUrls: ['./add-competitor.component.scss',]
})
export class AddCompetitorComponent {

  competitorList: ICompetidor[] = [];
  cargando: boolean = false;

  newCompetitonName: string = '';
  newSegmentation_value_id: number = 0;
  editingCompetitorId: number | null = null;
  originalCompetitor: ICompetidor | null = null;  
  familyList: { id: number, name: string }[] = [];
  paginatedData: ICompetidor[] =[];
  currentPage = 1;
  itemsPerPage = 10;
  
  constructor(
    private competitorsService: CompetidoresService,
    private filterService: FilterService,
    public dialogRef: MatDialogRef<AddCompetitorComponent>,
    public dialog: MatDialog,
    private _notifactionService: NotificationService,
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
          console.log(this.competitorList)
          this.paginate();
        },
        (error) => {
          console.error('Error al cargar los competidores', error);
          this.cargando = false;
        }
      );
      
  }

  cargarFamilias(): void {
    this.filterService.getFilterOptions('segmentacion-productos/1').subscribe(
      (families: { id: number, name: string }[]) => {
        this.familyList = families;
        console.log(this.familyList)
      },
      (error) => console.error(error)
    );
  }

  insertCompetitor(){
    if(this.newCompetitonName){
      const newCompetitor = {
        name: this.newCompetitonName,
        segmentation_value_id: this.newSegmentation_value_id,
        segmentation_value: ''
      };
      this.competitorsService.insertCompetitor(newCompetitor).subscribe(
        (status) =>{
          if(status === 'Success'){
            this._notifactionService.showSuccess('Competidor añadido con exito');
            this.cargarCompetitors();
            this.clearNewCompetitor();
          }
        },
        (error) =>{
          console.error('Error al añadir el competidor', error);
          this._notifactionService.showError('Error al añadir el competidor');
        }
      );
    }else{
      /// aqui mostramos el error
      this._notifactionService.showError('Por favor complete todos los campos.');
    }
  }
  // Activar modo de edición para un competidor específico y guardar los datos originales
  toggleEdit(competitorId: number) {
    const competitor = this.competitorList.find(c => c.id === competitorId);
    if (competitor) {
      this.originalCompetitor = { ...competitor };  // Hacer una copia de los datos originales
      this.editingCompetitorId = competitorId;
    }
  }

  // Guardar cambios y salir del modo de edición
  saveChanges(competitor: ICompetidor) {
    // Aquí puedes agregar lógica para guardar los cambios en el servidor
    if(competitor.name){
      this.competitorsService.updateCompetitors(competitor).subscribe(
        (status) =>{
          if(status === 'Success'){
            this._notifactionService.showSuccess('Competidor actualizado con éxito');
            this.cargarCompetitors();
            this.editingCompetitorId = null;
            this.originalCompetitor = null;
          }
        },
        (error) =>{
          console.error('Error al actualizar el competidor', error);
          this._notifactionService.showError('Error al actualizar al competidor');
          this.cancelEdit();
        }
      );
    }else{
      this._notifactionService.showError('Por favor complete todos los campos.');
    }
  }

  // Cancelar la edición sin guardar los cambios, restaurar los valores originales
  cancelEdit() {
    if (this.originalCompetitor) {
      const index = this.competitorList.findIndex(c => c.id === this.originalCompetitor!.id);
      if (index !== -1) {
        this.competitorList[index] = { ...this.originalCompetitor };  // Restaurar los valores originales
      }
    }
    this.editingCompetitorId = null;
    this.originalCompetitor = null; // Limpiar la copia temporal después de cancelar
  }

  /* limpiar el input */
  clearNewCompetitor() {
    this.newCompetitonName = '';
    this.newSegmentation_value_id= 0
  }

  deleteCompetidor(id: Number){
    this.dialog
      .open(ConfirmDialogComponent, {
        data: `¿Estas seguro de eliminar este competidor?`,
      })
      .afterClosed()
      .subscribe((confirmado: boolean) =>{
        if(confirmado){
          this.competitorsService.deleteCompetitor(id).subscribe((data) =>{
            if(data === 'Success'){
              this.cargarCompetitors();
              this.mensajeExito();
            }
          });
        }
      })
  }

  /* mesanje de exito */
  mensajeExito(){
    this._notifactionService.showSuccess('Competidor eliminado correctamente')
  }
  /* paginator */
  paginate() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedData = this.competitorList.slice(start, end);

  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.paginate();
  }
  onItemsPerPageChanged(itemsPerPage: number) {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.paginate()
  }

  getFamilyName(familyId: number): string {
    const family = this.familyList.find(f => f.id === familyId);
    return family ? family.name : 'Todas';
  }

  /* lógica de botón de Cancelar de Motivo de Rechazo */
  cerrarPopup() {
    this.dialogRef.close();
  }
}
