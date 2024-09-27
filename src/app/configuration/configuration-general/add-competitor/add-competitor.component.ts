import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICompetidor } from 'src/app/models/competidor.model';
import { FilterService } from 'src/app/services/filter/filter.service';
import { CompetidoresService } from 'src/app/services/competitors/competidores.service';
import { timeout } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/confirm-dialog/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-competitor',
  templateUrl: './add-competitor.component.html',
  styleUrls: ['./add-competitor.component.css']
})
export class AddCompetitorComponent {

  competitorList: ICompetidor[] = [];
  cargando: boolean = false;

  newCompetitonName: string = '';

  editingCompetitorId: number | null = null;
  originalCompetitor: ICompetidor | null = null;  // variable que se encarga de almacenar la variable original
  
  paginatedData: ICompetidor[] =[];
  currentPage = 1;
  itemsPerPage = 10;
  
  constructor(
    private competitorsService: CompetidoresService,
    public dialogRef: MatDialogRef<AddCompetitorComponent>,
    public dialog: MatDialog,
    public toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.cargarCompetitors();
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
        },
        (error) => {
          console.error('Error al cargar los competidores', error);
          this.cargando = false;
        }
      );
  }
  insertCompetitor(){
    if(this.newCompetitonName){
      const newCompetitor = {
        name: this.newCompetitonName
      };
      this.competitorsService.insertCompetitor(newCompetitor).subscribe(
        (status) =>{
          if(status === 'Success'){
            this.toastr.success('Competidor añadido con exito');
            this.cargarCompetitors();
            this.clearNewCompetitor();
          }
        },
        (error) =>{
          console.error('Error al añadir el competidor', error);
          this.toastr.error('Error al añadir el competidor', 'Error');
        }
      );
    }else{
      /// aqui mostramos el error
      this.toastr.error('Por favor complete todos los campos.', 'Error');
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
            this.toastr.success('Competidor actualizado con éxito');
            this.cargarCompetitors();
            this.editingCompetitorId = null;
            this.originalCompetitor = null;
          }
        },
        (error) =>{
          console.error('Error al actualizar el competidor', error);
          this.toastr.error('Error al actualizar al competidor', 'Error');
          this.cancelEdit();
        }
      );
    }else{
      this.toastr.error('Por favor complete todos los campos.', 'Error');
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
    this.toastr.success('Competidor eliminado correctamente', 'Exito',{
      timeOut: 2000,
    });
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

  /* lógica de botón de Cancelar de Motivo de Rechazo */
  cerrarPopup() {
    this.dialogRef.close();
  }
}
