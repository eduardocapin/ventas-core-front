import { Component, Input, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { MapData } from 'src/app/core/models/mapData.model';

@Component({
  selector: 'mobentis-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent {
  @Input() center: google.maps.LatLngLiteral = { lat: 40.4168, lng: -3.7038 }; // Default to Madrid
  @Input() zoom = 5;
  @Input() markersData: MapData[] = [];

  @ViewChild(GoogleMap) map!: GoogleMap;

  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    scrollwheel: true,
  };

  markers: google.maps.Marker[] = [];
  infoWindow: google.maps.InfoWindow | null = null;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.addMarkers();
    this.fitBoundsToMarkers();
  }

  addMarkers() {
    this.markers = this.markersData.map((data) => {
      const marker = new google.maps.Marker({
        position: { lat: data.latitude, lng: data.longitude },
        title: data.title,
        map: this.map?.googleMap,
        icon: data.iconUrl
          ? {
              url: data.iconUrl,
              scaledSize: new google.maps.Size(25, 33),
              size: new google.maps.Size(40, 40),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(20, 20),
            }
          : undefined,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: data.infoContent,
      });

      marker.addListener('click', () => {
        if (this.infoWindow) {
          this.infoWindow.close();
        }
        this.infoWindow = infoWindow;
        infoWindow.open(this.map?.googleMap, marker);
      });

      return marker;
    });
  }

  fitBoundsToMarkers() {
    if (this.map?.googleMap) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach((marker) =>
        bounds.extend(marker.getPosition() as google.maps.LatLng)
      );

      if (this.markers.length === 1) {
        this.map.googleMap.setCenter(bounds.getCenter());
        this.map.googleMap.setZoom(15);
      } else {
        this.map.googleMap.fitBounds(bounds);
      }
    }
  }
}
