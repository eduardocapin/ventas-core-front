import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ConfigurationService{
    constructor(private http: HttpClient){
    }

    async loadConfig(): Promise<void>{
        const fileContent = await firstValueFrom(this.http.get("assets/config.txt", {responseType: "text"}));
        this.parseConfig(fileContent);
    }

    private parseConfig(fileContent: string): void{
        const lines = fileContent.split("\n").map(line => line.trim());
        lines.forEach(line => {
            const [key, value] = line.split(";");
            if(key && value){
                switch (key.trim()) {
                    case 'IP':
                      localStorage.setItem('baseUrl', value.trim());
                      break;
                    case 'PUERTO_API':
                      localStorage.setItem('port', value.trim());
                      break;
                    case 'PUERTO_ARCHIVOS':
                      localStorage.setItem('puerto_archivos', value.trim());
                      break;
                    case 'PUERTO_INTEGRACION':
                      localStorage.setItem('puerto_integracion', value.trim());
                      break;
                  }
            }
        });
    }
}