export class CardList {
    private identifier: string;
    private elementID: string;

    get Identifier(): string {
        return this.identifier;
    }

    get ElementID(): string {
        return this.elementID;
    }

    constructor(identifier: string, elementID: string) {
        this.identifier = identifier;
        this.elementID = elementID;
    }
}
