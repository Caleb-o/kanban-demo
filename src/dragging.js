"use strict";

import { API } from "./api";
import { addDragListeners } from "./layout";

/**
 * @param {API} api
 */
export function setupDraggables(api) {
  const dragables = document.querySelectorAll(".task");
  const droppables = document.querySelectorAll(".list-content");

  dragables.forEach((task) => addDragListeners(task));
  droppables.forEach((zone) => setupListDragZone(api, zone));
}

/**
 * @param {API} api
 * @param {HTMLElement} zone
 */
export function setupListDragZone(api, zone) {
  zone.addEventListener("dragover", (e) => {
    e.preventDefault();

    const bottomTask = insertAboveTask(zone, e.clientY);
    const currentTask = document.querySelector(".is-dragging");

    const taskItem = api.getTaskFromID(currentTask.id);
    taskItem.setListID(zone.getAttribute("value"));

    if (!bottomTask) {
      zone.appendChild(currentTask);
    } else {
      zone.insertBefore(currentTask, bottomTask);
    }

    // Serialize to disk, after changes
    api.serializeToLocalStorage();
  });
}

function insertAboveTask(zone, mouseY) {
  // Grab all tasks that aren't currently being dragged
  const els = zone.querySelectorAll(".task:not(.is-dragging)");

  let closestTask = null;
  let closestOffset = Number.NEGATIVE_INFINITY;

  els.forEach((task) => {
    const { top } = task.getBoundingClientRect();
    const offset = mouseY - top;

    if (offset < 0 && offset > closestOffset) {
      closestOffset = offset;
      closestTask = task;
    }
  });

  return closestTask;
}
