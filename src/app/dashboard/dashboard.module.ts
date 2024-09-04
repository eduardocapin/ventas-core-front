import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardGeneralComponent } from './dashboard-general/dashboard-general.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { GraficaPedidosFamiliasProductosComponent } from '../components/grafica-pedidos-familias-productos/grafica-pedidos-familias-productos.component';
import { GraficaPedidosMesComponent } from '../components/grafica-pedidos-mes/grafica-pedidos-mes.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
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
import { GraficaMotivosComponent } from '../components/grafica-motivos/grafica-motivos.component';
import { GraficaPedidosDiaComponent } from '../components/grafica-pedidos-dia/grafica-pedidos-dia.component';
import { GraficaPedidosSegmentacion1Component } from '../components/grafica-pedidos-segmentacion1/grafica-pedidos-segmentacion1.component';
import { GraficaPedidosSegmentacion2Component } from '../components/grafica-pedidos-segmentacion2/grafica-pedidos-segmentacion2.component';
import { GraficaPedidosSegmentacion3Component } from '../components/grafica-pedidos-segmentacion3/grafica-pedidos-segmentacion3.component';
import { GraficaProductosTopComponent } from '../components/grafica-productos-top/grafica-productos-top.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    DashboardGeneralComponent,
    GraficaPedidosDiaComponent,
    GraficaClientesComponent,
    GraficaMotivosComponent,
    GraficaPedidosFamiliasProductosComponent,
    GraficaPedidosMesComponent,
    DecimalesPipe,
    EnterosPipe,
    GraficaPedidosSegmentacion1Component,
    GraficaPedidosSegmentacion2Component,
    GraficaPedidosSegmentacion3Component,
    GraficaProductosTopComponent,
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

    SharedModule,
  ],
  providers: [
    GraficaPedidosDiaComponent,
    GraficaMotivosComponent,
    GraficaClientesComponent,
    GraficaPedidosFamiliasProductosComponent,
    GraficaPedidosMesComponent,
    GraficaPedidosSegmentacion1Component,
    GraficaPedidosSegmentacion2Component,
    GraficaPedidosSegmentacion3Component,
    GraficaProductosTopComponent,
  ],
})
export class DahsboardModule { }
