/**
 * Interfaces alineadas con los DTOs del backend (PedidoListDto, PedidoDetalleDto, PedidoDetalleLineaDto).
 */

/** Línea de detalle de pedido (PedidosDetalle). */
export interface IPedidoLinea {
  id: number;
  comboIntegracion?: string;
  codigoArticulo?: string;
  descripcionArticulo?: string;
  codigoPromocion?: string;
  unidadesVendidas?: number;
  descripcionUnidadVendida?: string;
  importe?: number;
  descuento1?: number;
  descuento2?: number;
  descuento3?: number;
  descuento4?: number;
  descuento5?: number;
  total?: number;
  motivoDevolucion?: string;
  comboAdjunto?: string;
  notaLinea?: string;
  errorIntegracion?: string;
  referencia?: string;
  descripcion?: string;
  unidades?: number;
  precio?: number;
  descuento?: number;
  estadoIntegracion?: string;
  mensajeErrorIntegracion?: string;
}

/** Datos del agente que realizó la venta (desde Clientes por Cod_Agente_Fabricante). */
export interface IPedidoAgenteDatos {
  id?: number;
  nombre?: string;
  codigoAgenteFabricante?: string;
  codigoAgenteERP?: string;
}

/** Datos del cliente comprador (desde Clientes por Cod_Cliente_Fabricante = IdClienteFabricante). */
export interface IPedidoClienteDatos {
  codigo?: string;
  nombreComercial?: string;
  nombreFiscal?: string;
  cif?: string;
  direccion?: string;
  poblacion?: string;
  provincia?: string;
  telefono?: string;
  fax?: string;
  email?: string;
  banco?: string;
  cuenta?: string;
}

/** Datos de dirección del pedido (columnas Cliente_Direc, Cliente_Pobla, etc.). */
export interface IPedidoDireccionDatos {
  nombre?: string;
  direccion?: string;
  contacto?: string;
  poblacion?: string;
  provincia?: string;
  cp?: string;
  tfno?: string;
}

/** Pedido para listado (columnas tabla Importador de Documentos). Alineado con EntidadBD.nombreColumna. */
export interface IPedido {
  id: number;
  /** Pedidos.EstadoImportacion */
  estadoImportacion?: string;
  /** Pedidos.TipoDocumento */
  tipoDocumento?: string;
  /** Pedidos.Fecha_Pedido */
  fechaDocumento?: string | Date;
  /** Hora de Pedidos.FechaHoraFin */
  horaConsolidacion?: string;
  /** Pedidos.Entrega */
  fechaEntrega?: string | Date;
  /** Pedidos.Cod_Cliente_Fabricante */
  codigoCliente?: string;
  /** Pedidos.Cliente_N_Fiscal */
  clienteNFiscal?: string;
  /** Agentes.Nombre */
  nombreAgente?: string;
  /** Pedidos.Cod_Agente_Fabricante */
  codigoAgente?: string;
  /** Pedidos.Dto1 */
  dto1?: number;
  /** Pedidos.Dto2 */
  dto2?: number;
  /** Pedidos.DtoPP */
  dtoPP?: number;
  /** Pedidos.Importe */
  importe?: number;
  /** Pedidos.Total */
  total?: number;
  /** Pedidos.TieneFirma */
  tieneFirma?: boolean;
  /** Pedidos.ErroresIntegracion */
  errorIntegracion?: string;
  /** Pedidos.IdPedidoTipoERP (PedidosTotal.IdPedidoERP) */
  idPedidoTipoERP?: string;
  /** Pedidos.IdDocumentoPDA (código alfanumérico del documento, ej. P11-00078) */
  idDocumentoPDA?: string;
  /** Nombre de la empresa a la que pertenece el pedido */
  nombreEmpresa?: string;
  agenteDatos?: IPedidoAgenteDatos;
  totales?: {
    idPedidosTotalOPT?: number;
    subtotal?: number;
    dtos?: number;
    baseImp?: number;
    ivaPor?: number;
    ivaCuota?: number;
    rePor?: number;
    reCuota?: number;
    impuestosTotal?: number;
    total?: number;
  };
  // Legacy / compatibilidad
  tipoPedido?: string;
  codigoDocumento?: string;
  numero?: string;
  nombreCliente?: string;
  cliente?: string;
  agente?: string;
  fecha?: string | Date;
  delegacion?: string;
  origen?: string;
  nota?: string;
  observaciones?: string;
  estadoIntegracion?: string;
  mensajeErrorIntegracion?: string;
  codigoPda?: number;
  importeDescuento1?: number;
  importeDescuento2?: number;
  importeDescuentoDToPP?: number;
}

export interface IPedidoDetalle extends IPedido {
  observaciones?: string;
  observacionesComerciales?: string;
  observacionesReparto?: string;
  /** Nombre de la empresa a la que pertenece el pedido */
  nombreEmpresa?: string;
  /** Datos del cliente comprador (desde Clientes). */
  clienteDatos?: IPedidoClienteDatos;
  /** Datos de dirección (columnas del pedido). */
  datosDireccion?: IPedidoDireccionDatos;
  lineas: IPedidoLinea[];
}

export type PedidosKpisByEstado = Record<string, number>;
