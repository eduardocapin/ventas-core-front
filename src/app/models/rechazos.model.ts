export interface IRechazo{
    id: number;
    estados: string; // Nombre del estado
    fecha_rechazo: Date;
    poblacion: string; // Nombre de la población
    provincia: string; //Nombre de Provincia
    cliente: string;
    segmentacion1: string;
    segementacion2:string;
    producto: string;
    pvp: number;
    tipo_rechazo: string;
    competidor: string;
    pvp_promocion: string;
    /* pvp_competencia: number; */
    accion_correcta: string;
    propuesta_agente: string;
    anulado: boolean;
    rechazo_longitud: number;
    rechazo_latitud: number;
}