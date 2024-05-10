import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Map, NavigationControl, Marker } from 'maplibre-gl';

@Component({
  selector: 'app-popup-map',
  templateUrl: './popup-map.component.html',
  styleUrls: ['./popup-map.component.css']
})
export class PopupMapComponent implements OnInit, AfterViewInit, OnDestroy {
  map: Map | undefined;
  marker: Marker | undefined

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    if (this.mapContainer) {
      const initialState = { lng: 139.753, lat: 35.6844};
      // Crea el mapa de MapTiler en el elemento div
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=36bBxm9qzcAM0x9cGbYq', /* cambia el estilo que quieras usar para el estilo del mapa */
        center: [initialState.lng, initialState.lat],
        zoom: 14
      });
  
      // Agrega un marcador gráfico en las coordenadas especificadas
      this.marker = new Marker()
        .setLngLat([139.753, 35.6844]) // Coordenadas geográficas (longitud, latitud)
        .addTo(this.map);
    } else {
      console.error('mapElement is undefined.');
    }
  }

  ngOnDestroy() {
    // Elimina el mapa y el marcador cuando el componente se destruye para evitar fugas de memoria
    this.map?.remove();
    this.marker?.remove();
  }
}
