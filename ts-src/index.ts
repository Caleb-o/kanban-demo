import { API } from './api';
import { setupDraggables } from './dragging';
import {
    setupModalLayout,
    setupAddTask,
    setupListAddButton,
    setupErrorModalLayout,
} from './layout';

// 30 seconds
const serialiseInterval = 30 * 1000;

function main() {
    const api = new API();
    api.tryLoadFromLocalStorage();

    setInterval(() => api.serializeToLocalStorage(), serialiseInterval);

    setupAddTask(api);
    setupListAddButton(api);
    setupDraggables(api);

    setupErrorModalLayout();
    setupModalLayout();
}

window.addEventListener('load', main);
