"use strict";

export class CardList {
  get Identifier() {
    return this.identifier;
  }

  get ElementID() {
    return this.elementID;
  }

  constructor(identifier, elementID) {
    this.identifier = identifier;
    this.elementID = elementID;
  }
}
