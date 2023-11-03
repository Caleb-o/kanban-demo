"use strict";

import { API } from "./api";
import { setupDraggables } from "./dragging";
import {
  setupModalLayout,
  setupAddTask,
  setupListAddButton,
  setupErrorModalLayout,
} from "./layout";

function main() {
  const api = new API();
  api.tryLoadFromLocalStorage();

  setupAddTask(api);
  setupListAddButton(api);
  setupDraggables(api);

  setupErrorModalLayout();
  setupModalLayout();
}

window.addEventListener("load", main);
