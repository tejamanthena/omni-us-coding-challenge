interface FilterInterface {
    field: string;
    method: string;
    parameters: string | number[];
}

export class Filter implements FilterInterface {

    field ;
    method ;
    parameters;

    constructor(field: string, method: string, parameters: string | number[]) {
        this.field = field;
        this.method = method;
        this.parameters = parameters;
    }
}
