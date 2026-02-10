/**
 * Funciones de total por campo para el pie de mobentis-table (Core).
 * Cada clave es el field de la columna; el valor es una función que recibe los datos y devuelve el total.
 */
export interface ITotalFunctions {
  [field: string]: (data: any[]) => number | string;
}
