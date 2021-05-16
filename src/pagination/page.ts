
export class Page<T> {
    
    private _totalElements: number;
    private _totalPages: number;
    private _amount: number;
    private _activePage: number;
    private _elements: Array<T>;

    constructor(totalElements: number, totalPages: number, amount: number, activePage: number, elements: Array<T>) {
        this._totalElements = totalElements;
        this._totalPages = totalPages;
        this._amount = amount;
        this._activePage = activePage;
        this._elements = elements;
    }

    public get totalElements(): number {
        return this._totalElements;
    }

    public get totalPages(): number {
        return this._totalPages;
    }

    public get amaount(): number {
        return this._amount;
    }

    public get activePage(): number {
        return this._activePage;
    }

    public get elements(): Array<T> {
        return this._elements;
    }

}