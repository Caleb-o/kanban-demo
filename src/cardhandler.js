"use strict";

import { listNameToID } from "./api";
import { CardList } from "./cardlist";

export class CardHandler {
  get HasDefault() {
    return this.hasDefault;
  }

  get Lists() {
    return this.lists;
  }

  constructor() {
    this.hasDefault = false;
    this.lists = new Map();
  }

  setHasDefault() {
    this.hasDefault = this.lists.has("New List");
  }

  /**
   * 
   * @param {CardList} list 
   */
  push(list) {
    this.lists.set(list.Identifier, list);
  }

  /**
   * @returns {boolean}
   */
  tryAddNewList() {
    if (this.hasDefault) {
      return false;
    }

    this.lists.set("New List", new CardList("New List", "new-list"));
    this.hasDefault = true;

    return true;
  }

  /**
   * 
   * @param {string} identifier 
   * @returns 
   */
  removeWithID(identifier) {
    for (const [id, list] of this.lists.entries()) {
      if (list.ElementID === identifier) {
        this.lists.delete(id);
        this.setHasDefault();
        return;
      }
    }
  }

  /**
   * @param {string} oldID 
   * @param {string} newID
   */
  renameTaskList(oldID, newID) {
    const oldCard = this.lists.get(oldID);
    if (oldCard) {
      this.lists.delete(oldID);
      this.lists.set(newID, oldCard);
      return;
    }

    this.lists.set(newID, new CardList(newID, listNameToID(newID)));
  }
}
