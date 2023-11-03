"use strict";

export const TagKind = {
  Programming: 0,
  Graphics: 1,
  Documentation: 2,
};

export class TaskItem {
  // Properties
  get ID() {
    return this.id;
  }

  get CreatedAt() {
    return this.createdAt;
  }

  get ListID() {
    return this.listID;
  }

  get Title() {
    return this.title;
  }

  get Tag() {
    return this.tag;
  }

  get DueDate() {
    return this.dueDate;
  }

  get Color() {
    return this.color;
  }

  get Description() {
    return this.description;
  }

  /**
   * 
   * @param {string} id 
   * @param {Date} createdAt 
   * @param {string} listID 
   * @param {string} title 
   * @param {TagKind} tag 
   * @param {Date | null} dueDate 
   * @param {string} color 
   * @param {string} description 
   */
  constructor(
    id,
    createdAt,
    listID,
    title,
    tag,
    dueDate,
    color,
    description
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.listID = listID;
    this.title = title;
    this.tag = tag;
    this.dueDate = dueDate;
    this.color = color;
    this.description = description;
  }

  /**
   * 
   * @param {TaskItem} item 
   * @returns 
   */
  static fromLoadedData(item) {
    return new TaskItem(
      item.id,
      new Date(item.createdAt),
      item.listID,
      item.title,
      item.tag,
      !item.dueDate ? null : new Date(item.dueDate),
      item.color,
      item.description
    );
  }

  /**
   * 
   * @param {string} listID 
   */
  setListID(listID) {
    this.listID = listID;
  }

  /**
   * 
   * @param {string} title 
   * @param {TagKind} tag 
   * @param {Date | null} dueDate 
   * @param {string} color 
   * @param {string} description 
   */
  applyFields(
    title,
    tag,
    dueDate,
    color,
    description
  ) {
    this.title = title;
    this.tag = tag;
    this.dueDate = dueDate;
    this.color = color;
    this.description = description;
  }
}

/**
 * 
 * @param {string} tagStr 
 * @returns 
 */
export function tagStrToKind(tagStr) {
  switch (tagStr) {
  case "prg":
    return TagKind.Programming;
  case "gfx":
    return TagKind.Graphics;
  case "doc":
    return TagKind.Documentation;
  default:
    throw new Error(`Undefined tag kind '${tagStr}'`);
  }
}

/**
 * 
 * @param {TagKind} tag 
 * @returns 
 */
export function tagKindToStr(tag) {
  switch (tag) {
  case TagKind.Programming:
    return "prg";
  case TagKind.Graphics:
    return "gfx";
  case TagKind.Documentation:
    return "doc";
  }
}
