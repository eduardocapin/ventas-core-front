import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardGeneralComponent } from './dashboard-general/dashboard-general.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { GraficaPedidosFamiliasProductosComponent } from '../components/grafica-pedidos-familias-productos/grafica-pedidos-familias-productos.component';
import { GraficaPedidosMesComponent } from '../components/grafica-pedidos-mes/grafica-pedidos-mes.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GraficaVentasDiaComponent } from '../components/grafica-ventas-dia/grafica-ventas-dia.component';
import { GraficaVentasFamiliasProductosComponent } from '../components/grafica-ventas-familias-productos/grafica-ventas-familias-productos.component';
import { GraficaVentasHoraComponent } from '../components/grafica-ventas-hora/grafica-ventas-hora.component';
import { GraficaVentasMesComponent } from '../components/grafica-ventas-mes/grafica-ventas-mes.component';
import { GraficaAtencionClienteComponent } from '../components/grafica-atencion-cliente/grafica-atencion-cliente.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { DecimalesPipe } from './pipes/decimales.pipe';
import { EnterosPipe } from './pipes/enteros.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GraficaClientesComponent } from '../components/grafica-clientes/grafica-clientes.component';
import { GraficaPedidosComponent } from '../components/grafica-pedidos/grafica-pedidos.component';
import { GraficaPedidosDiaComponent } from '../components/grafica-pedidos-dia/grafica-pedidos-dia.component';
import { GraficaPedidosHoraComponent } from '../components/grafica-pedidos-hora/grafica-pedidos-hora.component';
import { GraficaPedidosSegmentacion1Component } from '../components/grafica-pedidos-segmentacion1/grafica-pedidos-segmentacion1.component';
import { GraficaPedidosSegmentacion2Component } from '../components/grafica-pedidos-segmentacion2/grafica-pedidos-segmentacion2.component';
import { GraficaPedidosSegmentacion3Component } from '../components/grafica-pedidos-segmentacion3/grafica-pedidos-segmentacion3.component';
import { GraficaVentasSegmentacion1Component } from '../components/grafica-ventas-segmentacion1/grafica-ventas-segmentacion1.component';
import { GraficaVentasSegmentacion2Component } from '../components/grafica-ventas-segmentacion2/grafica-ventas-segmentacion2.component';
import { GraficaVentasSegmentacion3Component } from '../components/grafica-ventas-segmentacion3/grafica-ventas-segmentacion3.component';
import { GraficaProductosTopComponent } from '../components/grafica-productos-top/grafica-productos-top.component';
import { GraficaVentasTopComponent } from '../components/grafica-ventas-top/grafica-ventas-top.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    DashboardGeneralComponent,
    GraficaPedidosDiaComponent,
    GraficaPedidosComponent,
    GraficaPedidosHoraComponent,
    GraficaClientesComponent,
    GraficaPedidosFamiliasProductosComponent,
    GraficaPedidosMesComponent,
    GraficaVentasDiaComponent,
    GraficaVentasFamiliasProductosComponent,
    GraficaVentasHoraComponent,
    GraficaVentasMesComponent,
    GraficaAtencionClienteComponent,
    DecimalesPipe,
    EnterosPipe,
    GraficaPedidosSegmentacion1Component,
    GraficaPedidosSegmentacion2Component,
    GraficaPedidosSegmentacion3Component,
    GraficaVentasSegmentacion1Component,
    GraficaVentasSegmentacion2Component,
    GraficaVentasSegmentacion3Component,
    GraficaProductosTopComponent,
    GraficaVentasTopComponent,

  ],
  imports: [
    MatButtonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    CommonModule,
    DashboardRoutingModule,
    MatSidenavModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatTooltipModule,
  ],
  providers: [
    GraficaPedidosDiaComponent,
    GraficaPedidosComponent,
    GraficaPedidosHoraComponent,
    GraficaClientesComponent,
    GraficaPedidosFamiliasProductosComponent,
    GraficaPedidosMesComponent,
    GraficaVentasDiaComponent,
    GraficaVentasFamiliasProductosComponent,
    GraficaVentasHoraComponent,
    GraficaVentasMesComponent,
    GraficaAtencionClienteComponent,
    GraficaPedidosSegmentacion1Component,
    GraficaPedidosSegmentacion2Component,
    GraficaPedidosSegmentacion3Component,
    GraficaVentasSegmentacion1Component,
    GraficaVentasSegmentacion2Component,
    GraficaVentasSegmentacion3Component,
    GraficaProductosTopComponent,
    GraficaVentasTopComponent,
  ],
})
export class DahsboardModule { }
