import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IPareja } from 'src/app/models/pareja.model';
import { ImportExcelService } from 'src/app/services/import/import-excel.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import * as XLSX from 'xlsx';
import { ImportTableName } from 'src/app/models/importTableName.model';
import { ImportTableField } from 'src/app/models/importTableField.model';

@Component({
  selector: 'app-excel-import',
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.scss'],
})
export class ExcelImportComponent {

  isDragging = false;

  tablaActiva: number= -1;
  tablasMobentis: any[] = [];
  tablasMobentisReales: any[]=[];
  fields: ImportTableField[] = [];
  selectedTableId: number = 1; 

  camposTablaSeleccionada: any[] = [];
  camposTablaSeleccionadaObligatorios: string[] = [];
  camposTablaRealSeleccionada: string[] = [];
  ExcelData: any[] = [];
  selectedSheet: any = null;
  dropdownVisible: { [key: string]: boolean };
  isSheetEmpty: boolean = false;
  listaDeEmparejamientoDeCampos: IPareja[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _excelImportServices: ImportExcelService,
    private _notifactionService: NotificationService
  ) {
    this.route.params.subscribe((params) => {
      this.tablaActiva = params['tabla'] ? Number(params['tabla']) : -1;
    });
    this.cambiarTablaCabecera();
    this.dropdownVisible = {};
  }

  ngOnInit(): void {
    this.loadTables();
    if (this.tablaActiva >= 0) {
      this.cambiarTablaCabecera();
    }
  }

  loadTables() {
    this._excelImportServices.getTablesName().subscribe(
      (data) => {
        console.log('Tablas recibidas:', data);
        this.tablasMobentis = data;
      },
      (error) => {
        console.error('Error al cargar los nombres de tablas', error);
      }
    );
  }

  onTableSelect(tableId: number): void {
    console.log('Tabla seleccionada con ID:', tableId);
    this.tablaActiva = tableId;
    this.cambiarTablaCabecera(tableId);
  }

  /// Para lograr el arrastreado de archivos excel a la pagina
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
  
      // Validar el tipo de archivo
      if (
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      ) {
        this.ReadExcel({ target: { files: [file] } }); // Reutiliza tu lógica existente
      } else {
        this._notifactionService.showError('Por favor, arrastre un archivo Excel válido.');
      }
  
      event.dataTransfer.clearData();
    }
  }

  ngAfterContentInit(): void {
    window.scrollTo(0, 0);
  }

  abrirInput(): void {
    var boton = document.getElementById('boton')!;
    boton.click();
  }

  ReadExcel(event: any) {
    let file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;

      // Reiniciar ExcelData al cargar un nuevo archivo
      this.ExcelData = [];
      this.selectedSheet = null;
      let hojasVacias: string[] = [];
      
      /* Se pondra el nombre de las hojas */
      sheetNames.forEach((sheetName) => {
        let jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);

        /* se pone en el array las hojas si esta vacias */
        if (jsonData.length === 0) {
          hojasVacias.push(sheetName);
        } else {
          this.ExcelData.push({ sheetName: jsonData, name: sheetName }); /* se añade las hojas  */
          this.dropdownVisible[sheetName] = false; // Inicializar la visibilidad del menú desplegable como falso para cada hoja
        }
      });

      // Mostrar mensaje de advertencia si hay hojas vacías
      if (hojasVacias.length > 0) {
        this._notifactionService.showWarning(
          `Las siguientes hojas están vacías y no serán procesadas: ${hojasVacias.join(', ')}`
        );
      }

      // Establecer la primera hoja como seleccionada automáticamente
      if (this.ExcelData.length > 0) {
        this.selectedSheet = this.ExcelData[0];
        this.isSheetEmpty = this.selectedSheet.sheetName.length === 0; // Verificar si está vacía

        // Reiniciar lista de emparejamientos de campos
        this.listaDeEmparejamientoDeCampos = [];
        if (!this.isSheetEmpty) {
          Object.keys(this.selectedSheet.sheetName[0]).forEach((key) => {
            this.listaDeEmparejamientoDeCampos.push({ origen: key });
          });
        }
      } else {
        this.isSheetEmpty = true; // Si no hay hojas
      }
    };
  }

  // Método para obtener los nombres de las columnas de la hoja seleccionada
  getColumnNames() {
    if (this.selectedSheet.sheetName.length > 0) {
      return Object.keys(this.selectedSheet.sheetName[0]);
    }
    return [];
  }

  getOrigenes(array: IPareja[]) {
    let resultado: string[] = [];
    array.forEach((elemento) => {
      resultado.push(elemento.origen);
    });
    return resultado;
  }

  // Método para mostrar la tabla correspondiente al hacer clic en un botón
  showTable(sheetName: string): void {
    const selectedSheetData = this.ExcelData.find(sheet => sheet.name === sheetName);
  
    if (selectedSheetData) {
    this.selectedSheet = selectedSheetData;
    this.isSheetEmpty = selectedSheetData.sheetName.length === 0; // Actualiza el estado según los datos de la hoja

      // Reiniciar lista de emparejamientos de campos si la hoja tiene datos
      this.listaDeEmparejamientoDeCampos = [];
      if (!this.isSheetEmpty) {
        Object.keys(this.selectedSheet.sheetName[0]).forEach((key) => {
          this.listaDeEmparejamientoDeCampos.push({ origen: key });
        });
      }
    } else {
      this.selectedSheet = null;
      this.isSheetEmpty = true;
    }
  }

  // Método para mostrar u ocultar el menú desplegable de un botón específico
  toggleDropdown(sheetName: string, visible: boolean) {
    this.dropdownVisible[sheetName] = visible;
  }

  cambiarTablaCabecera(tablaId?: number): void {
    const id = tablaId !== undefined ? tablaId : this.tablaActiva;
    const tablaSeleccionada = this.tablasMobentis.find((tabla) => +tabla.id === +id);
  
    if (!tablaSeleccionada) {
      console.warn('No se ha seleccionado una tabla válida.');
      this.camposTablaSeleccionada = [];
      this.camposTablaSeleccionadaObligatorios = [];
      this.camposTablaRealSeleccionada = [];
      return;
    }
  
    this._excelImportServices.getImportTableField(id).subscribe(
      (data) => {
        this.camposTablaSeleccionada = data;
        console.log(
          `Campos seleccionados (Tabla: ${tablaSeleccionada.show_table_name}):`,
          this.camposTablaSeleccionada
        );
      },
      (error) => {
        console.error('Error al cargar los campos de la tabla:', error);
      }
    );
  }
  

  importar() {
    let columnasObligatoriasNoSeleccionadas =
      this.columnasObligatoriasNoSeleccionadas();

    if (columnasObligatoriasNoSeleccionadas.length <= 0) {
      let values: {}[] = [];
      this.selectedSheet.sheetName.forEach((linea: any) => {
        let data: any = {};
        this.listaDeEmparejamientoDeCampos.forEach((emparejamiento) => {
          if (emparejamiento.destino) {
            let nombreCampoReal =
              this.camposTablaRealSeleccionada[
                this.camposTablaSeleccionada.indexOf(emparejamiento.destino)
              ];
            data[nombreCampoReal] = linea[emparejamiento.origen];
          }
        });
        let datoRecarga = {
          id: Object.values(linea)[0],
          data: data,
        };
        values.push(datoRecarga);
      });
      console.log(values);
      console.log('T' + Date.now());

      let recarga = {
        schema: localStorage.getItem('schema'),
        apikey: 'test',
        table: this.tablasMobentisReales[this.tablaActiva],
        primary_key: 'internal_id',
        process_id: 'P' + Date.now(),
        process_type: 'Parcial',
        values: values,
      };

      console.log(JSON.stringify(recarga));
      console.log('Update realizada con exito');
      this.router.navigateByUrl('/mobentis/configuracion/global');
      this._notifactionService.showSuccess(
        'Los datos se han importado correctamente'
      );
      /*
      this._excelImportServices
        .importExcel(
          recarga
        )
        .subscribe((data) => {
          if (data === 'Success') {
            
          }
        });
        */
    } else {
      let mensajeError = 'Error, debes seleccionar los siguientes campos: ';
      columnasObligatoriasNoSeleccionadas.forEach((columna, index) => {
        mensajeError += columna;
        if (index != columnasObligatoriasNoSeleccionadas.length - 1) {
          mensajeError += ', ';
        }
      });
      this._notifactionService.showError(mensajeError);
    }
  }

  handleFileInputChange(event: any) {
    let selectedFile = event.target.files;
    if (selectedFile) {
      const file: File | null = selectedFile.item(0);
      if (file) {
        if (
          file.type !==
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
          file.type !== 'text/csv'
        ) {
          this._notifactionService.showError('Solo se permite seleccionar archivos Excel o CSV');
          this.handleFileInputChange(event);
        } else {
          this.ReadExcel(event);
        }
      }
    }
  }

  volverAConfig() {
    this.router.navigateByUrl('/mobentis/configuracion/global');
  }

  resetListaDeEmparejamientoDeCampos() {
    this.listaDeEmparejamientoDeCampos.forEach((pareja) => {
      pareja.destino = '';
    });
  }

  borrarSeleccionesSimilares(parejaSeleccionada: IPareja) {
    this.listaDeEmparejamientoDeCampos.forEach((pareja) => {
      if (
        pareja.origen != parejaSeleccionada.origen &&
        pareja.destino == parejaSeleccionada.destino
      ) {
        pareja.destino = '';
      }
    });
  }

  columnasObligatoriasNoSeleccionadas() {
    const camposDestinoSeleccionados = this.listaDeEmparejamientoDeCampos.map((pareja) => pareja.destino);
    return this.camposTablaSeleccionadaObligatorios.filter((campo) => !camposDestinoSeleccionados.includes(campo));
  }

  destinosSeleccionados() {
    let camposDestinoSeleccionados: string[] = [];
    this.listaDeEmparejamientoDeCampos.forEach((pareja) => {
      if (pareja.destino) {
        camposDestinoSeleccionados.push(pareja.destino);
      }
    });

    return camposDestinoSeleccionados;
  }
}
