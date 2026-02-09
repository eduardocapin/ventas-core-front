import { Component, Input } from '@angular/core';

@Component({
    selector: 'mobentis-modern-form-field',
    templateUrl: './modern-form-field.component.html',
    styleUrls: ['./modern-form-field.component.scss']
})
export class ModernFormFieldComponent {
    @Input() label: string = '';
    @Input() icon: string = '';
    @Input() editable: boolean = false;
    @Input() highlight: boolean = false;
    @Input() date: boolean = false;
    @Input() error: string = '';
    @Input() required: boolean = false;
    @Input() suffix: string = '';
}
