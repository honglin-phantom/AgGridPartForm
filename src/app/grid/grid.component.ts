import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { Column, ColumnApi, GridApi, GridReadyEvent, RowNode } from 'ag-grid-community';
import { FormCellComponent } from './form-cell/form-cell.component';
import { BranchService } from '../branch.service';

@Component({
    selector: 'app-grid',
    templateUrl: 'grid.component.html',
    styleUrls: ['grid.component.css']
})
export class GridComponent {
    @ViewChild(FormCellComponent)
    private formCell: FormCellComponent;
    private api: GridApi;
    private columnApi: ColumnApi;

    /* 当前格子系统拥有一个表单控制源, 其包含了四个独立的表单控制器 */
    gridForm: FormGroup = new FormGroup({
        salesperson: new FormControl(),
        telephone: new FormControl(),
        address: new FormControl(),
        stock: new FormGroup({}) /* 设置 stock 为独立的表单群包括所有格子系统的表单控制器 */
    });

    /* 下拉组件包含的数据 */
    branchNames: string[];
    /* 被选中的下拉组件的数据 */
    selectedBranch: string;

    columnDefs: any;
    rowData: any;

    constructor(public snackBar: MatSnackBar, private branchService: BranchService) {
        this.columnDefs = [
            { headerName: 'Order #', field: 'orderNumber', width: 110, suppressSizeToFit: true },
            { headerName: 'Make', field: 'make', cellRenderer: this.formCell },
            { headerName: 'Model', field: 'model', cellRenderer: this.formCell },
            { headerName: 'Price', field: 'price', cellRenderer: this.formCell }
        ];

        /* 通过启动分支服务中的 branches() getter 方法从服务中返回分支列表 */
        this.branchNames = this.branchService.branches;
        /* 默认被选中的分支为首元素 */
        this.selectedBranch = this.branchNames[0];
        /* 更新表单 */
        this.updateForm();
    }

    /* 更新大表单而非格子系统控制的局部表单 */
    updateForm() {
        /* 通过分支服务中的 getter 方法得到当前的分支 */
        const currentBranch = this.branchService.getBranchData(this.selectedBranch);
        /* 对应更新当前格子表单的表单控制器 */
        /* 在当前表单下映射到 salesperson 的表单控制器并通过当前分支返回的数据来更新控制器数据 */
        this.gridForm.controls.salesperson.patchValue(currentBranch.salesperson);
        this.gridForm.controls.telephone.patchValue(currentBranch.telephone);
        /* currentBranch: Object 以键值对儿形式包含 Branch 的信息 */
        this.gridForm.controls.address.patchValue(currentBranch.address);
        /* 派遣更新后对应的表单控制器数据 */

        /* 独立的格子系统存储 stock 列表数据 */
        this.rowData = currentBranch.stock;
    }

    /* when grid is ready */
    gridReady(params: GridReadyEvent) {
        this.api = params.api;
        this.columnApi = params.columnApi;

        /* 更新表单控制器 */
        this.refreshFormControls();
        this.api.sizeColumnsToFit();
    }

    private refreshFormControls() {
        /* if current grid API is valid and be ready */
        if (this.api) {
            /* update with the most recent form data for form controls */
            this.createFormControls();
            /* force cell to be refreshed after update */
            this.api.refreshCells({force: true});
        }
    }

    /* 创建表单控制器 */
    private createFormControls() {
        const columns = this.columnApi.getAllColumns();
        /* 独立的格子系统控制的表单群, 将当前格子的所有表单控制器强行转换为表单群 */
        const stockGroup = this.gridForm.controls.stock as FormGroup;

        /* 如果在分支中切换则清空之前的表单控制器 */
        /* 得到当前格子系统中所有表单控制器的名字 */
        const controlNames = Object.keys(stockGroup.controls);

        controlNames.forEach((controlName) => {
            /* 将表单控制器从当前表单群中移除 */
            stockGroup.removeControl(controlName);
        });

        /* 创建新的表单控制器 */
        this.api.forEachNode((rowNode: RowNode) => {
            columns.filter((column: Column) => column.getColDef().field !== 'OrderNumber')
                .forEach((column: Column) => {
                    const key = this.createKey(rowNode.id, column);
                    /* 切换分支后将新建的表单控制器加入到原有的表单群中 */
                    stockGroup.addControl(key, new FormControl());
                });
        });
    }

    /* current grid context only controls part of the wider form */
    getContext() {
        return {
            /* grid is a part of the wider form */
            formGroup: this.gridForm.controls.stock,
            createKey: this.createKey
        };
    }

    onSubmit() {
        console.dir(this.gridForm.value);

        this.snackBar.open('Open Console for Form State', null, {
            verticalPosition: 'top',
            duration: 2000
        });
    }

    private createKey(rowId: string, column: Column) {
        return `${rowId}${column.getColId()}`;
    }
}
