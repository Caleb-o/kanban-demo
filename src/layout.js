"use strict";

import { API, listNameToID } from "./api";
import { setupListDragZone } from "./dragging";
import { tagKindToStr, tagStrToKind } from "./task";

/**
 * 
 * @param {API} api 
 */
export function setupListAddButton(api) {
  const btn = document.querySelector("#list-add-btn");
  btn.onclick = () => {
    const listDiv = document.querySelector("#task-lists");
    const listEl = createDefaultList(api);
    if (!listEl) {
      showErrorModal("Cannot create default list, as one already exists.");
      return;
    }

    listDiv.insertBefore(listEl, listDiv.children[listDiv.children.length - 1]);

    // Save results to disk
    api.serializeToLocalStorage();
  };
}

export function setupErrorModalLayout() {
  const modal = document.querySelector("#error-modal");
  const close = document.querySelector("#error-modal-close");

  close.onclick = function (e) {
    e.preventDefault();
    modal.style.display = "none";
  };
}

export function setupModalLayout() {
  // Get the modal
  const modal = document.querySelector("#modal");
  const modalHeader = document.querySelector("#modal-header");

  // Get the <span> element that closes the modal
  const span = document.querySelector("#close");
  const colorSelected = document.querySelector("#color-selected");
  const firstStyle = colorSelected.options[0].style;
  colorSelected.value = firstStyle.backgroundColor;
  colorSelected.style.background = firstStyle.backgroundColor;

  span.onclick = function () {
    modal.style.display = "none";
  };

  colorSelected.onchange = function () {
    const color = colorSelected.options[colorSelected.selectedIndex].style.backgroundColor;

    colorSelected.style.backgroundColor = color;
    modalHeader.style.backgroundColor = color;
  };
}

/**
 * 
 * @param {HTMLElement} el 
 */
export function addDragListeners(el) {
  el.addEventListener("dragstart", () => {
    el.classList.add("is-dragging");
  });
  el.addEventListener("dragend", () => {
    el.classList.remove("is-dragging");
  });
}

/**
 * 
 * @param {string} message 
 */
export function showErrorModal(message) {
  const errorModal = document.querySelector("#error-modal");
  const modalText = document.querySelector("#error-modal-text") ;

  modalText.innerText = message;
  errorModal.style.display = "block";
}

/**
 * 
 * @param {API} api 
 */
export function setupAddTask(api) {
  const form = document.querySelector("#add-task-btn");

  form.onclick = (e) => {
    e.preventDefault();

    const lists = document.querySelectorAll(".swim-list");
    if (lists.length === 0) {
      showErrorModal("No lists available to add a task.");
      return;
    }

    const modal = document.querySelector("#modal");
    modal.style.display = "block";
    setupNewTaskModalFields(api);
  };
}

/**
 * 
 * @param {API} api 
 */
export function setupNewTaskModalFields(api) {
  const modal = document.querySelector("#modal");
  const modalHeader = document.querySelector("#modal-header");
  const createdOn = document.querySelector("#created-on");
  const taskTitle = document.querySelector("#task-title");
  const taskDesc = document.querySelector("#task-desc");
  const saveBtn = document.querySelector("#modal-save-btn");
  const deleteBtn = document.querySelector("#modal-delete-btn");

  const tagKind = document.querySelector("#kind-option");
  tagKind.value = "prg";

  const dueDate = document.querySelector("#due-date");
  dueDate.valueAsDate = null;

  const colorSelected = document.querySelector("#color-selected");
  const firstStyle = colorSelected.options[0].style;
  colorSelected.value = firstStyle.backgroundColor;
  colorSelected.style.background = firstStyle.backgroundColor;

  modalHeader.style.backgroundColor = colorSelected.value;

  const taskTitleText = `Task Title #${api.CurrentTaskIndex + 1}`;
  taskTitle.value = taskTitleText;
  taskDesc.value = "";

  const date = new Date();
  modal.style.display = "block";
  createdOn.innerText = `Created on ${date.toDateString()}`;

  saveBtn.onclick = () => {
    if (taskTitle.value === taskTitleText) {
      showErrorModal("Invalid title name.");
      return;
    }

    // Add to todo list
    const firstList = document.querySelectorAll(".swim-list")[0];
    const listContent = firstList.querySelector(".list-content");

    const taskEl = createTaskItemElement(api, taskTitle.value, api.CurrentTaskIndex);
    listContent.appendChild(taskEl);

    const tagKind = document.querySelector("#kind-option");
    const dueDate = document.querySelector("#due-date");
    const colorSelected = document.querySelector("#color-selected");

    api.addNewTask(
      date,
      firstList.id,
      taskTitle.value,
      tagStrToKind(tagKind.value),
      dueDate.valueAsDate,
      colorSelected.style.background,
      taskDesc.value
    );

    // Save results to disk
    api.serializeToLocalStorage();

    // Hide modal
    modal.style.display = "none";
  };

  // Hide delete button when creating new task
  deleteBtn.style.display = "none";
}

/**
 * 
 * @param {API} api 
 */
export function generateElementsFromLoadedData(api) {
  const listDiv = document.querySelector("#task-lists");

  // Generate all list elements
  api.TaskLists.forEach((list) => {
    const listEl = createListWithName(api, list.Identifier);
    listDiv.insertBefore(listEl, listDiv.children[listDiv.children.length - 1]);
  });

  // Generate all task elements
  api.Tasks.forEach((task) => {
    const list = document.querySelector(`#${task.ListID}`);
    const content = list.querySelector(".list-content");
    content.appendChild(createTaskItemElement(api, task.Title, task.ID));
  });
}

/**
 * 
 * @param {API} api 
 * @param {string} taskID 
 */
function populateTaskModalFields(api, taskID) {
  const task = api.getTaskFromID(taskID);

  const modal = document.querySelector("#modal");
  const modalHeader = document.querySelector("#modal-header");
  const createdOn = document.querySelector("#created-on");
  const taskTitle = document.querySelector("#task-title");
  const saveBtn = document.querySelector("#modal-save-btn");
  const deleteBtn = document.querySelector("#modal-delete-btn");
  const taskDesc = document.querySelector("#task-desc");

  const tagKind = document.querySelector("#kind-option");
  const dueDate = document.querySelector("#due-date-option");
  const colorSelected = document.querySelector("#color-selected");

  const taskTitleText = task.Title;
  taskTitle.value = taskTitleText;
  taskDesc.value = task.Description;
  createdOn.innerText = `Created on ${task.CreatedAt.toDateString()}`;

  tagKind.value = tagKindToStr(task.Tag);
  dueDate.valueAsDate = task.DueDate;

  modalHeader.style.background = task.Color;
  colorSelected.value = task.Color;
  colorSelected.style.background = task.Color;

  saveBtn.onclick = () => {
    task.applyFields(
      taskTitle.value,
      tagStrToKind(tagKind.value),
      dueDate.valueAsDate,
      colorSelected.style.background,
      taskDesc.value
    );

    // Save results to disk
    api.serializeToLocalStorage();

    // Hide modal
    modal.style.display = "none";
  };

  deleteBtn.style.display = "inline";
  deleteBtn.onclick = () => {
    // TODO: Add confirmation modal

    api.removeTaskItem(task);

    const listEl = document.querySelector(`#${task.ListID}`);
    const content = listEl.querySelector(".list-content");
    content.removeChild(document.querySelector(`#task-id-${task.ID}`));

    // Save results to disk
    api.serializeToLocalStorage();

    // Hide modal
    modal.style.display = "none";
  };

  // Show modal
  modal.style.display = "block";
}

/**
 * 
 * @param {API} api 
 * @param {string} taskTitle 
 * @param {number} index 
 * @returns 
 */
function createTaskItemElement(api, taskTitle, index) {
  /**
     * <div class="task" draggable="true">
            <p class="task-title">Get Groceries</p>
            <button class="task-edit">...</button>
        </div>
     */
  const taskID = `task-id-${index}`;
  const newTask = document.createElement("div");
  newTask.className = "task";
  newTask.id = taskID;
  newTask.setAttribute("draggable", "true");

  const taskTitleEl = document.createElement("p");
  newTask.appendChild(taskTitleEl);

  taskTitleEl.className = "task-title";
  taskTitleEl.innerText = taskTitle;

  const innerBtn = document.createElement("button");
  newTask.appendChild(innerBtn);

  innerBtn.className = "task-edit";
  innerBtn.innerText = "...";
  innerBtn.onclick = () => populateTaskModalFields(api, taskID);

  addDragListeners(newTask);

  return newTask;
}

/**
 * 
 * @param {API} api 
 * @returns 
 */
function createDefaultList(api) {
  if (!api.tryAddNewList()) {
    return null;
  }

  return createListWithName(api, "New List");
}

/**
 * 
 * @param {API} api 
 * @param {string} title 
 * @returns 
 */
function createListWithName(api, title) {
  /**
     * <div class="swim-list" id="todo-list">
            <input class="list-heading" type="text">TODO</h3>
        </div>
     */
  const listID = listNameToID(title);

  const el = document.createElement("div");
  el.className = "swim-list";
  el.id = listID;

  const header = document.createElement("div");
  el.appendChild(header);
  header.className = "list-heading-inner-text";

  const headerTitle = document.createElement("input");
  header.appendChild(headerTitle);

  headerTitle.className = "list-heading-input";
  headerTitle.type = "text";
  headerTitle.value = title;
  headerTitle.defaultValue = title;

  headerTitle.onchange = (e) => listHeaderChange(el, headerTitle, e, api);

  const listContentZone = document.createElement("div");
  el.appendChild(listContentZone);

  listContentZone.setAttribute("value", listID);
  listContentZone.className = "list-content";

  setupListDragZone(api, listContentZone);

  const deleteSpan = document.createElement("span");
  header.appendChild(deleteSpan);

  deleteSpan.className = "list-delete-span";
  deleteSpan.innerText = "\u{00D7}";
  deleteSpan.onclick = (e) => {
    e.preventDefault();

    if (listContentZone.children.length > 0) {
      showErrorModal("Cannot delete list that contains tasks.");
      return;
    }

    const listDiv = document.querySelector("#task-lists");
    listDiv.removeChild(el);

    api.deleteTaskList(listID);

    // Save results to disk
    api.serializeToLocalStorage();
  };

  return el;
}

/**
 * 
 * @param {HTMLElement} el 
 * @param {HTMLInputElement} self 
 * @param {Event} e 
 * @param {API} api 
 * @returns 
 */
function listHeaderChange(el, self, e, api) {
  e.preventDefault();

  const newID = listNameToID(self.value);
  if (el.id === newID) {
    return;
  }

  if (api.taskListContains(self.value)) {
    showErrorModal(`Task list with name '${self.value}' already exists.`);
    self.value = self.defaultValue;
    return;
  }

  const content = el.querySelector(".list-content");
  content.setAttribute("value", newID);

  api.renameTaskList(self.defaultValue, self.value);

  self.defaultValue = self.value;
  el.id = newID;

  // Save results to disk
  api.serializeToLocalStorage();
}
