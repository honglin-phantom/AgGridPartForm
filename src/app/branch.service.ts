import { Injectable } from '@angular/core';

/* 定义一个类接口实现包装数据 Object */
export interface Branch {
    salesperson: string;
    telephone: string;
    address: string;
    stock: any[];
}

@Injectable()
export class BranchService {
    /* 每一个键对应的都是一个 Branch 类的数据 Object */
    private branchData = {
        Balham: {
            salesperson: 'Michael',
            address: '1 Station Road\nBalham\nLondon\nSW1 1JT',
            telephone: '0208 123123',
            stock: [
                { orderNumber: 1, make: 'Toyota', model: 'Celica', price: 35000 },
                { orderNumber: 5, make: 'Ford', model: 'Mondeo', price: 32000 },
                { orderNumber: 7, make: 'Porsche', model: 'Boxter', price: 72000 },
                { orderNumber: 11, make: 'Seat', model: 'Leon', price: 32000 },
                { orderNumber: 20, make: 'Honda', model: 'CRV', price: 35000 }
            ]
        },
        Horley: {
            salesperson: 'Christopher',
            address: '1 Main Car Park\nHorley\nHH1 1JT',
            telephone: '0101 0132321',
            stock: [
                { orderNumber: 3, make: 'Lada', model: 'XRAY', price: 2000 },
                { orderNumber: 4, make: 'Fiat', model: 'Punto', price: 10000 },
                { orderNumber: 8, make: 'Honda', model: 'Jazz', price: 100 },
                { orderNumber: 15, make: 'Morris', model: 'Marina', price: 3200 },
                { orderNumber: 18, make: 'Austin', model: 'Allergro', price: 5100 }
            ]
        }
    };

    /* 定义 getter 方法返回分支列表 */
    get branches(): string[] {
        /* keys: names of the Enumberable properties and methods on an Object */
        return Object.keys(this.branchData);
    }

    /* 返回的是 Branch 类的数据 Object */
    getBranchData(branch: string): Branch {
        return this.branchData[branch];
    }
}
