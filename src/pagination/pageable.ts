export class Pageable {
    private _size: number;
    private _page: number;

    constructor(size: number, page: number) {
        this._size = size;
        this._page = page;
    }

    public get size(): number {
        return this._size;
    }

    public get page(): number {
        return this._page;
    }

    public get offset(): number {
        return this._page * this._size;
    }

    public static of(size: number, page: number) {
        return new Pageable(size, page);
    }
}
