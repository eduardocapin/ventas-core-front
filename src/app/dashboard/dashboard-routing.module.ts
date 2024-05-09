import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { DashboardGeneralComponent } from "./dashboard-general/dashboard-general.component";

const routes: Routes =[
    {path: "global", component: DashboardGeneralComponent},
]

@NgModule({
    declarations: [],
    imports:[
        RouterModule.forChild(routes),
        CommonModule
    ],
    exports:[RouterModule],
})
export class DashboardRoutingModule{};