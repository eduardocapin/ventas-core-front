import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'mobentis_rechazos';

  ngOnInit() {
    this.loadGoogleMapsScript();
  }

  private loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=TU_API_KEY`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
}
