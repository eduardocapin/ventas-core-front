import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, Inject } from '@angular/core';
import { Map, Marker } from 'maplibre-gl';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserData } from '../rechazos-general.component';

@Component({
  selector: 'app-popup-map',
  templateUrl: './popup-map.component.html',
  styleUrls: ['./popup-map.component.css']
})
export class PopupMapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  markers: Marker[] = []; // Array para almacenar los marcadores

  constructor(
    public dialogRef: MatDialogRef<PopupMapComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){}

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
  }

  getLatLongFromRow(row: any): { lat: number, lng: number } {
    if (row && typeof row.latitud === 'number' && typeof row.longitud === 'number') {
      const lat = parseFloat(row.latitud);
      const lng = parseFloat(row.longitud);
      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    // Si hay un error o los valores no son válidos, devuelve un objeto con valores por defecto
    return { lat: 0, lng: 0 };
  }

  ngAfterViewInit() {
    if (this.mapContainer && this.data && this.data.selectedRows) {
      
      /* Coordenadas donde se abrirar el mapa */
      const initialState = { lng: -3.74922, lat: 40.4637 }; 

      // Crea el mapa de MapTiler en el elemento div
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=36bBxm9qzcAM0x9cGbYq', /* cambia el estilo que quieras usar para el estilo del mapa */
        center: [initialState.lng, initialState.lat],
        zoom: 5
      });
      // Iterar sobre las filas seleccionadas y agregar un marcador para cada una
      this.data.selectedRows.forEach((row: UserData) => {
        const { lat, lng } = this.getLatLongFromRow(row); // Obtener latitud y longitud de la fila
        if (this.map) {
          const marker = new Marker()
            .setLngLat([lng, lat])
            .addTo(this.map);
          this.markers.push(marker); // Agregar el marcador al array
        } else {
          console.error('No se pudo crear el marcador. El mapa no está definido.');
        }
      });

  

      
    } else {
      console.error('mapElement is undefined.');
    }
  }

  ngOnDestroy() {
    // Elimina el mapa y los marcadores cuando el componente se destruye para evitar fugas de memoria
    this.map?.remove();
    this.markers.forEach(marker => {
      marker.remove();
    });
  }

  /* lógica para cerrar el popup */
  close(){
    this.dialogRef.close();
  }
}
