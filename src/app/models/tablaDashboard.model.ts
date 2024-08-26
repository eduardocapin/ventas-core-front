export interface ITablaDashboard {
  nombre: string;
  total: number;
  rechazos: { [tipo: string]: number };
}
