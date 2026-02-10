import { ITableColumn } from './tableColumn.model';

export interface ITableSortEvent {
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

export interface ITableSelectionEvent {
  selectedIds: number[];
}

export interface ITableEvent {
  type: string;
  data?: any;
  column?: ITableColumn;
  item?: any;
}
