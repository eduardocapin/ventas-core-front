/**
 * Modelo de columna para mobentis-table (Core).
 * Usado por TableComponent y EntityTableManagerComponent.
 */
export interface ITableColumn {
  field: string;
  header: string;
  type?: 'checkbox' | 'text' | 'date' | 'number' | 'currency' | 'acciones' | 'boolean' | 'image' | 'objetivo-estado' | 'objetivo-monetario';
  sortable?: boolean;
  sticky?: 'left' | 'right' | 'none';
  hideable?: boolean;
  visible?: boolean;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  align?: 'left' | 'center' | 'right';
  headerIcon?: string;
  tooltip?: string;
  /** Acciones para tipo 'acciones': 'view' | 'edit' | 'delete' | 'duplicate' | 'file' */
  actions?: string[];
  pinable?: boolean;
  resizable?: boolean;
  imageShape?: 'circle' | 'square';
  decimalPlaces?: number;
  useGrouping?: boolean;
  /** Si la columna puede mostrar total en el pie (totalFunctions). */
  totalizable?: boolean;
}
