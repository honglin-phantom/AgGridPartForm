import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-form-cell',
    templateUrl: 'form-cell.component.html'
})
export class FormCellComponent {
    formGroup: FormGroup;
    key;
    private value;
    columnName: string;

    agInit(params: any) {
        this.columnName = params.column.colDef.headerName;
        this.key = params.context.createKey(params.node.id, params.column);
        this.value = params.value;
    }

    refresh(params: any): boolean {
        this.formGroup = params.context.formGroup;

        this.formGroup.controls[this.key].patchValue(this.value);
        return true;
    }
}
