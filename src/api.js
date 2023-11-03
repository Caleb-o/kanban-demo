"use strict";

import { CardHandler } from "./cardhandler";
import { CardList } from "./cardlist";
import { generateElementsFromLoadedData } from "./layout";
import { TaskItem } from "./task";


export class API {
  get Tasks() {
    return this.tasks;
  }

  get TaskLists() {
    return Array.from(this.cardHandler.Lists.values());
  }

  get CurrentTaskIndex() {
    return this.currentTaskIndex;
  }

  constructor() {
    this.currentTaskIndex = 0;
    this.tasks = new Map();
    this.cardHandler = new CardHandler();
  }

  serializeToLocalStorage() {
    const kanbanStr = JSON.stringify({
      index: this.currentTaskIndex,
      tasks: Array.from(this.tasks.entries()),
      taskLists: Array.from(this.cardHandler.Lists.keys()),
    });
    localStorage.setItem("my-kanban-board", kanbanStr);
  }

  tryLoadFromLocalStorage() {
    const boardDataStr = localStorage.getItem("my-kanban-board");
    if (!boardDataStr) {
      return;
    }

    const boardData = JSON.parse(boardDataStr);
    this.currentTaskIndex = boardData.index;

    boardData.tasks.forEach((item) =>
      this.tasks.set(item[0], TaskItem.fromLoadedData(item[1]))
    );
    boardData.taskLists.forEach((list) =>
      this.cardHandler.push(new CardList(list, listNameToID(list)))
    );

    this.cardHandler.setHasDefault();

    generateElementsFromLoadedData(this);
  }

  removeTaskItem(item) {
    this.tasks.delete(item.ID);
  }

  tryAddNewList() {
    return this.cardHandler.tryAddNewList();
  }

  /**
  * @param {string} identifier
  */
  taskListContains(identifier) {
    return this.cardHandler.Lists.has(identifier);
  }

  /**
  * @param {string} oldID
  * @param {string} newID
  */
  renameTaskList(oldID, newID) {
    this.cardHandler.renameTaskList(oldID, newID);
    this.cardHandler.setHasDefault();
  }

  /**
  * @param {string} identifier
  */
  deleteTaskList(identifier) {
    this.cardHandler.removeWithID(identifier);
  }

  /**
  * @param {Date} createdAt
  * @param {string} listID
  * @param {string} title
  * @param {string} tag
  * @param {Date} dueDate
  * @param {string} color
  * @param {string} description
  */
  addNewTask(
    createdAt,
    listID,
    title,
    tag,
    dueDate,
    color,
    description
  ) {
    this.tasks.set(
      this.currentTaskIndex,
      new TaskItem(
        this.currentTaskIndex,
        createdAt,
        listID,
        title,
        tag,
        dueDate,
        color,
        description
      )
    );
    this.advanceTask();
  }

  /**
   * @param {string} identifier
   * @returns {TaskItem}
   */
  getTaskFromID(identifier) {
    const indexStr = identifier.lastIndexOf("-") + 1;
    const taskIndex = +identifier.slice(indexStr);
    const task = this.tasks.get(taskIndex);
    if (!task) {
      console.log(identifier);
      throw new Error(`Fatal task fetch error. Tried to fetch item with index: ${taskIndex}`);
    }
    return task;
  }

  advanceTask() {
    this.currentTaskIndex += 1;
  }
}

/**
 * @param {string} value 
 * @returns 
 */
export function listNameToID(value) {
  let newName = new String(value);
  newName = newName.replace(" ", "-").toLocaleLowerCase().concat("-list");
  return newName.toString();
}
