import { API } from './api';
import { addDragListeners } from './layout';

export function setupDraggables(api: API) {
    const dragables = document.querySelectorAll('.task') as NodeListOf<HTMLElement>;
    const droppables = document.querySelectorAll('.list-content') as NodeListOf<HTMLElement>;

    dragables.forEach((task) => addDragListeners(task));
    droppables.forEach((zone) => setupListDragZone(api, zone));
}

export function setupListDragZone(api: API, zone: HTMLElement) {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();

        const bottomTask = insertAboveTask(zone, e.clientY);
        const currentTask = document.querySelector('.is-dragging') as HTMLElement;

        const taskItem = api.getTaskFromID(currentTask.id);
        taskItem.setListID(zone.getAttribute('value')!);

        if (!bottomTask) {
            zone.appendChild(currentTask);
        } else {
            zone.insertBefore(currentTask, bottomTask);
        }
    });
}

function insertAboveTask(zone: HTMLElement, mouseY: number): HTMLElement | null {
    // Grab all tasks that aren't currently being dragged
    const els = zone.querySelectorAll('.task:not(.is-dragging)') as NodeListOf<HTMLElement>;

    let closestTask: HTMLElement | null = null;
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
