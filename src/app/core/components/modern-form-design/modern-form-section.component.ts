import { Component, Input } from '@angular/core';

@Component({
    selector: 'mobentis-modern-form-section',
    templateUrl: './modern-form-section.component.html',
    styleUrls: ['./modern-form-section.component.scss']
})
export class ModernFormSectionComponent {
    @Input() sectionTitle: string = '';
    @Input() icon: string = '';
    @Input() marginBottom: string = '0.5rem';
    @Input() headerBackground: string = '';
    @Input() fullHeight: boolean = false;
}
