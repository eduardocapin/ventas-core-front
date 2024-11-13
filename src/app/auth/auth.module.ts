import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth/auth.component';

import { HttpClientModule } from '@angular/common/http';
import {NgIf} from '@angular/common';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './reset-password/change-password/change-password.component';
import { RouterModule } from '@angular/router';




@NgModule({
    declarations: [
        AuthComponent,
        ResetPasswordComponent,
        ChangePasswordComponent
    ],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatDividerModule,
        MatButtonModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgIf,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        MatDialogModule,
        RouterModule
    ]
})
export class AuthModule {}