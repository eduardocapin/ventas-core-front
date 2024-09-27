import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IPareja } from 'src/app/models/pareja.model';

import { ImportExcelService } from 'src/app/services/import/import-excel.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-excel-import',
  templateUrl: './excel-import.component.html',
  styleUrls: ['./excel-import.component.scss']
})
export class ExcelImportComponent {
  tablaActiva: number;
  tablasMobentis: any[] = ["Clientes","Vendedores", "Rechazos"];
  tablasMobentisReales: any[] = ["customers", "salesmen", "rechazos"];

  camposCustomers: string[] = ["Id Cliente", "Nombre", "Nombre Fiscal", "cif", "Id Provincia", "Provincia", "Id Población", "Población", "CP", "Dirección", "Teléfono 1", "Teléfono 2", "Email", "Segmentacion 1", "Segmentacion 2", "Segmentacion 3"];
  camposCustomersObligatorios: string[] = ["Id Cliente", "Nombre", "Nombre Fiscal", "cif", "Id Provincia", "Provincia", "Id Población", "Población", "CP", "Dirección", "Teléfono 1", "Teléfono 2", "Email", "Segmentacion 1", "Segmentacion 2", "Segmentacion 3"];
  camposCustomersReales: string[] = ["customer_ERP_id", "name", "tax_name", "cif", "province_ERP_id", "province", "city_ERP_id", "city", "pc", "adress", "phone_1", "phone_2", "email", "segmentation_1", "segmentation_2", "segmentation_3"]
  
  camposSalesmen: string[] = ["Id Vendedor", "Nombre", "Teléfono", "Email"];
  camposSalesmenObligatorios: string[] = ["Id Vendedor", "Nombre", "Teléfono", "Email"];
  camposSalesmenReales: string[] = ["salesman_ERP_id", "name", "phone", "email"];
  
  camposRechazos: string[] = ["Estado", "Poblacion", "Provincia", "Id Cliente","Producto","Tipo Rechazo"];
  camposRechazosObligatorios: string[] = [];
  camposRechazosReales: string[] = ["id_estado", "id_poblacion", "id_provincia", "id_cliente","id_producto","id_tipo_rechazo"];

  camposTablaSeleccionada: string[] = [];
  camposTablaSeleccionadaObligatorios: string[] = [];
  camposTablaRealSeleccionada: string[] = [];
  ExcelData: any[] = [];
  selectedSheet: any = null;
  dropdownVisible: { [key: string]: boolean }; // Objeto para rastrear la visibilidad del menú desplegable por hoja

  listaDeEmparejamientoDeCampos: IPareja[] = [];

  constructor(private router: Router, private _snackBar: MatSnackBar, private route: ActivatedRoute, private _excelImportServices: ImportExcelService) {

    this.tablaActiva = 0;
    route.params.subscribe(params => {
      if (params) {
        this.tablaActiva = Number(params['tabla']);
      }
    });
    this.cambiarTablaCabecera();
    this.dropdownVisible = {};
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

      // Iterar sobre cada nombre de hoja
      sheetNames.forEach(sheetName => {
        // Convertir cada hoja en un objeto JSON y agregarlo a la matriz ExcelData
        let jsonData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
        this.ExcelData.push({ sheetName: jsonData, name: sheetName }); // Añadir el nombre de la hoja junto con los datos
        this.dropdownVisible[sheetName] = false; // Inicializar la visibilidad del menú desplegable como falso para cada hoja
      });

      // Establecer la primera hoja como la hoja seleccionada automáticamente
      if (this.ExcelData.length > 0) {
        this.selectedSheet = this.ExcelData[0];
        this.listaDeEmparejamientoDeCampos = [];
        Object.keys(this.selectedSheet.sheetName[0]).forEach((key) => {
          this.listaDeEmparejamientoDeCampos.push({ origen: key })
        })
      }
    }
  }

  // Método para obtener los nombres de las columnas de la hoja seleccionada
  getColumnNames() {
    if (this.selectedSheet.sheetName.length > 0) {
      return Object.keys(this.selectedSheet.sheetName[0])
    }
    return [];
  }

  getOrigenes(array: IPareja[]) {
    let resultado: string[] = [];
    array.forEach((elemento) => {
      resultado.push(elemento.origen);
    })
    return resultado;
  }

  // Método para mostrar la tabla correspondiente al hacer clic en un botón
  showTable(sheetName: string) {
    this.selectedSheet = this.ExcelData.find(sheet => sheet.name === sheetName);
  }

  // Método para mostrar u ocultar el menú desplegable de un botón específico
  toggleDropdown(sheetName: string, visible: boolean) {
    this.dropdownVisible[sheetName] = visible;
  }

  cambiarTablaCabecera() {
    switch (this.tablaActiva) {
      case 0:
        this.camposTablaSeleccionada = this.camposCustomers;
        this.camposTablaSeleccionadaObligatorios = this.camposCustomersObligatorios;
        this.camposTablaRealSeleccionada = this.camposCustomersReales;
        break;
      case 1:
        this.camposTablaSeleccionada = this.camposSalesmen;
        this.camposTablaSeleccionadaObligatorios = this.camposSalesmenObligatorios;
        this.camposTablaRealSeleccionada = this.camposSalesmenReales;
        break;
      case 2:
        this.camposTablaSeleccionada = this.camposRechazos;
        this.camposTablaSeleccionadaObligatorios = this.camposRechazosObligatorios;
        this.camposTablaRealSeleccionada = this.camposRechazosReales;
        break;

    }
    this.resetListaDeEmparejamientoDeCampos();
  }

  importar() {
    let columnasObligatoriasNoSeleccionadas = this.columnasObligatoriasNoSeleccionadas();

    if (columnasObligatoriasNoSeleccionadas.length <= 0) {
      let values: {}[] = [];
      this.selectedSheet.sheetName.forEach((linea: any) => {
        let data: any = {};
        this.listaDeEmparejamientoDeCampos.forEach((emparejamiento) => {
          if (emparejamiento.destino) {
            let nombreCampoReal = this.camposTablaRealSeleccionada[this.camposTablaSeleccionada.indexOf(emparejamiento.destino)];
            data[nombreCampoReal] = linea[emparejamiento.origen];
          }
        });
        let datoRecarga = {
          'id': Object.values(linea)[0],
          'data': data
        }
        values.push(datoRecarga)
      })
      console.log(values)
      console.log("T" + Date.now());

      let recarga =
      {
        "schema": localStorage.getItem('schema'),
        "apikey": "test",
        "table": this.tablasMobentisReales[this.tablaActiva],
        "primary_key": "internal_id",
        "process_id": "P" + Date.now(),
        "process_type": "Parcial",
        "values": values
      };

      console.log(JSON.stringify(recarga))
      console.log('Update realizada con exito');
            this.router.navigateByUrl("/mobentis/configuracion/global")
            this._snackBar.open('Los datos se han importado correctamente', '', {
              duration: 2000,
            });
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
      let mensajeError = 'Error, debes seleccionar los siguientes campos: '
      columnasObligatoriasNoSeleccionadas.forEach((columna, index) => {
        mensajeError += columna
        if (index != columnasObligatoriasNoSeleccionadas.length - 1) {
          mensajeError += ', '
        }
      })
      this._snackBar.open(mensajeError, 'X');
    }
  }

  handleFileInputChange(event: any) {
    let selectedFile = event.target.files;
    if (selectedFile) {
      const file: File | null = selectedFile.item(0);
      if (file) {
        if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type !== 'text/csv') {
          this._snackBar.open('ERROR: Solo se permite seleccionar archivos Excel o CSV', '', {
            duration: 2000,
          });
          this.handleFileInputChange(event)
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
      pareja.destino = ''
    })
  }

  borrarSeleccionesSimilares(parejaSeleccionada: IPareja) {
    this.listaDeEmparejamientoDeCampos.forEach((pareja) => {
      if (pareja.origen != parejaSeleccionada.origen && pareja.destino == parejaSeleccionada.destino) {
        pareja.destino = "";
      }
    })
  }

  columnasObligatoriasNoSeleccionadas() {
    let columnasObligatorioasNoSeleccionadas: string[] = [];
    let camposDestinoSeleccionados = this.destinosSeleccionados();

    for (let campoObligatorio of this.camposTablaSeleccionadaObligatorios) {
      if (!camposDestinoSeleccionados.includes(campoObligatorio)) {
        columnasObligatorioasNoSeleccionadas.push(campoObligatorio)
      }
    }
    return columnasObligatorioasNoSeleccionadas;
  }

  destinosSeleccionados() {
    let camposDestinoSeleccionados: string[] = [];
    this.listaDeEmparejamientoDeCampos.forEach((pareja) => {
      if (pareja.destino) {
        camposDestinoSeleccionados.push(pareja.destino);
      }
    })

    return camposDestinoSeleccionados;
  }
}
