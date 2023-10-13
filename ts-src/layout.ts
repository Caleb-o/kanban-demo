import { API, listNameToID } from './api';
import { setupListDragZone } from './dragging';
import { tagKindToStr, tagStrToKind } from './task';

export function setupListAddButton(api: API) {
    const btn = document.querySelector('#list-add-btn') as HTMLButtonElement;
    btn.onclick = () => {
        const listDiv = document.querySelector('#task-lists') as HTMLDivElement;
        const listEl = createDefaultList(api);
        if (!listEl) {
            showErrorModal('Cannot create default list, as one already exists.');
            return;
        }

        listDiv.insertBefore(listEl, listDiv.children[listDiv.children.length - 1]);
    };
}

export function setupErrorModalLayout() {
    const modal = document.querySelector('#error-modal') as HTMLDivElement;
    const close = document.querySelector('#error-modal-close') as HTMLButtonElement;

    close.onclick = function (e) {
        e.preventDefault();
        modal.style.display = 'none';
    };
}

export function setupModalLayout() {
    // Get the modal
    const modal = document.querySelector('#modal') as HTMLElement;
    const modalHeader = document.querySelector('#modal-header') as HTMLElement;

    // Get the <span> element that closes the modal
    const span = document.querySelector('#close') as HTMLSpanElement;
    const colorSelected = document.querySelector('#color-selected') as HTMLSelectElement;
    const firstStyle = colorSelected.options[0].style;
    colorSelected.value = firstStyle.backgroundColor;
    colorSelected.style.background = firstStyle.backgroundColor;

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = 'none';
    };

    colorSelected.onchange = function () {
        let color = colorSelected.options[colorSelected.selectedIndex].style.backgroundColor;

        colorSelected.style.backgroundColor = color;
        modalHeader.style.backgroundColor = color;
    };
}

export function addDragListeners(el: HTMLElement) {
    el.addEventListener('dragstart', () => {
        el.classList.add('is-dragging');
    });
    el.addEventListener('dragend', () => {
        el.classList.remove('is-dragging');
    });
}

export function showErrorModal(message: string) {
    const errorModal = document.querySelector('#error-modal') as HTMLElement;
    const modalText = document.querySelector('#error-modal-text') as HTMLHeadingElement;

    modalText.innerText = message;
    errorModal.style.display = 'block';
}

export function setupAddTask(api: API) {
    const form = document.querySelector('#add-task-btn') as HTMLButtonElement;

    form.onclick = (e) => {
        e.preventDefault();

        const lists = document.querySelectorAll('.swim-list') as NodeListOf<HTMLElement>;
        if (lists.length === 0) {
            showErrorModal('No lists available to add a task.');
            return;
        }

        const modal = document.querySelector('#modal') as HTMLElement;
        modal.style.display = 'block';
        setupNewTaskModalFields(api);
    };
}

export function setupNewTaskModalFields(api: API) {
    const modal = document.querySelector('#modal') as HTMLElement;
    const modalHeader = document.querySelector('#modal-header') as HTMLElement;
    const createdOn = document.querySelector('#created-on') as HTMLInputElement;
    const taskTitle = document.querySelector('#task-title') as HTMLInputElement;
    const taskDesc = document.querySelector('#task-desc') as HTMLTextAreaElement;
    const saveBtn = document.querySelector('#modal-save-btn') as HTMLButtonElement;

    const tagKind = document.querySelector('#kind-option') as HTMLSelectElement;
    tagKind.value = 'prg';

    const dueDate = document.querySelector('#due-date') as HTMLInputElement;
    dueDate.valueAsDate = null;

    const colorSelected = document.querySelector('#color-selected') as HTMLSelectElement;
    const firstStyle = colorSelected.options[0].style;
    colorSelected.value = firstStyle.backgroundColor;
    colorSelected.style.background = firstStyle.backgroundColor;

    modalHeader.style.backgroundColor = colorSelected.value;

    const taskTitleText = `Task Title #${api.CurrentTaskIndex + 1}`;
    taskTitle.value = taskTitleText;
    taskDesc.value = '';

    const date = new Date();
    modal.style.display = 'block';
    createdOn.innerText = `Created on ${date.toDateString()}`;

    saveBtn.onclick = () => {
        if (taskTitle.value === taskTitleText) {
            showErrorModal('Invalid title name.');
            return;
        }

        // Add to todo list
        const firstList = (document.querySelectorAll('.swim-list') as NodeListOf<HTMLElement>)[0];
        const listContent = firstList.querySelector('.list-content') as HTMLDivElement;

        const taskEl = createTaskItemElement(api, taskTitle.value, api.CurrentTaskIndex);
        listContent.appendChild(taskEl);

        const tagKind = document.querySelector('#kind-option') as HTMLSelectElement;
        const dueDate = document.querySelector('#due-date') as HTMLInputElement;
        const colorSelected = document.querySelector('#color-selected') as HTMLSelectElement;

        api.addNewTask(
            date,
            firstList.id,
            taskTitle.value,
            tagStrToKind(tagKind.value),
            dueDate.valueAsDate,
            colorSelected.style.background,
            taskDesc.value
        );

        // Hide modal
        modal.style.display = 'none';
    };
}

export function generateElementsForLoadedData(api: API) {
    const listDiv = document.querySelector('#task-lists') as HTMLDivElement;

    // Generate all list elements
    api.TaskLists.forEach((list) => {
        const listEl = createListWithName(api, list.Identifier);
        listDiv.insertBefore(listEl, listDiv.children[listDiv.children.length - 1]);
    });

    // Generate all task elements
    api.Tasks.forEach((task) => {
        console.log(task);

        console.log(`Loading '${task.ListID}'`);
        const list = document.querySelector(`#${task.ListID}`) as HTMLDivElement;
        const content = list.querySelector('.list-content') as HTMLDivElement;
        content.appendChild(createTaskItemElement(api, task.Title, task.ID));
    });
}

function populateTaskModalFields(api: API, taskID: string) {
    const task = api.getTaskFromID(taskID);

    const modal = document.querySelector('#modal') as HTMLElement;
    const modalHeader = document.querySelector('#modal-header') as HTMLElement;
    const createdOn = document.querySelector('#created-on') as HTMLElement;
    const taskTitle = document.querySelector('#task-title') as HTMLInputElement;
    const saveBtn = document.querySelector('#modal-save-btn') as HTMLButtonElement;
    const taskDesc = document.querySelector('#task-desc') as HTMLTextAreaElement;

    const tagKind = document.querySelector('#kind-option') as HTMLSelectElement;
    const dueDate = document.querySelector('#due-date-option') as HTMLInputElement;
    const colorSelected = document.querySelector('#color-selected') as HTMLSelectElement;

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
        // Hide modal
        modal.style.display = 'none';
    };

    // Show modal
    modal.style.display = 'block';
}

function createTaskItemElement(api: API, taskTitle: string, index: number): HTMLElement {
    /**
     * <div class="task" draggable="true">
            <p class="task-title">Get Groceries</p>
            <button class="task-edit">...</button>
        </div>
     */
    const taskID = `task-id-${index}`;
    const newTask = document.createElement('div') as HTMLDivElement;
    newTask.className = 'task';
    newTask.id = taskID;
    newTask.setAttribute('draggable', 'true');

    const taskTitleEl = document.createElement('p') as HTMLParagraphElement;
    newTask.appendChild(taskTitleEl);

    taskTitleEl.className = 'task-title';
    taskTitleEl.innerText = taskTitle;

    const innerBtn = document.createElement('button');
    newTask.appendChild(innerBtn);

    innerBtn.className = 'task-edit';
    innerBtn.innerText = '...';
    innerBtn.onclick = () => populateTaskModalFields(api, taskID);

    addDragListeners(newTask);

    return newTask;
}

function createDefaultList(api: API): HTMLElement | null {
    if (!api.tryAddNewList()) {
        return null;
    }

    return createListWithName(api, 'New List');
}

function createListWithName(api: API, title: string): HTMLElement {
    /**
     * <div class="swim-list" id="todo-list">
            <input class="list-heading" type="text">TODO</h3>
        </div>
     */
    const listID = listNameToID(title);

    const el = document.createElement('div') as HTMLDivElement;
    el.className = 'swim-list';
    el.id = listID;

    const header = document.createElement('div') as HTMLDivElement;
    el.appendChild(header);
    header.className = 'list-heading-inner-text';

    const headerTitle = document.createElement('input') as HTMLInputElement;
    header.appendChild(headerTitle);

    headerTitle.className = 'list-heading-input';
    headerTitle.type = 'text';
    headerTitle.value = title;
    headerTitle.defaultValue = title;

    headerTitle.onchange = (e) => listHeaderChange(el, headerTitle, e, api);

    const deleteSpan = document.createElement('span') as HTMLSpanElement;
    header.appendChild(deleteSpan);

    deleteSpan.className = 'list-delete-span';
    deleteSpan.innerText = '\u{00D7}';
    deleteSpan.onclick = (e) => {
        e.preventDefault();

        if (el.children.length > 1) {
            showErrorModal('Cannot delete list that contains tasks.');
            return;
        }

        api.deleteTaskList(listID);

        const listDiv = document.querySelector('#task-lists') as HTMLDivElement;
        listDiv.removeChild(el);
    };

    const listContentZone = document.createElement('div') as HTMLDivElement;
    el.appendChild(listContentZone);

    listContentZone.setAttribute('value', listID);
    listContentZone.className = 'list-content';

    setupListDragZone(api, listContentZone);

    return el;
}

function listHeaderChange(el: HTMLElement, self: HTMLInputElement, e: Event, api: API) {
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

    const content = el.querySelector('.list-content') as HTMLElement;
    content.setAttribute('value', newID);

    api.renameTaskList(self.defaultValue, self.value);
    self.defaultValue = self.value;
    el.id = newID;
}
