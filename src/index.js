"use strict";

import { API } from "./api";
import { setupDraggables } from "./dragging";
import {
  setupModalLayout,
  setupAddTask,
  setupListAddButton,
  setupErrorModalLayout,
} from "./layout";

window.addEventListener("load", function() {
  const api = new API();
  api.tryLoadFromLocalStorage();

  setupAddTask(api);
  setupListAddButton(api);
  setupDraggables(api);

  setupErrorModalLayout();
  setupModalLayout();
});
