/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/api.js":
/*!********************!*\
  !*** ./src/api.js ***!
  \********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.listNameToID = exports.API = void 0;\nconst cardhandler_1 = __webpack_require__(/*! ./cardhandler */ \"./src/cardhandler.js\");\nconst cardlist_1 = __webpack_require__(/*! ./cardlist */ \"./src/cardlist.js\");\nconst layout_1 = __webpack_require__(/*! ./layout */ \"./src/layout.js\");\nconst task_1 = __webpack_require__(/*! ./task */ \"./src/task.js\");\nclass API {\n    get Tasks() {\n        return this.tasks;\n    }\n    get TaskLists() {\n        return Array.from(this.cardHandler.Lists.values());\n    }\n    get CurrentTaskIndex() {\n        return this.currentTaskIndex;\n    }\n    constructor() {\n        this.currentTaskIndex = 0;\n        this.tasks = new Map();\n        this.cardHandler = new cardhandler_1.CardHandler();\n    }\n    serializeToLocalStorage() {\n        const kanbanStr = JSON.stringify({\n            index: this.currentTaskIndex,\n            tasks: Array.from(this.tasks.entries()),\n            taskLists: Array.from(this.cardHandler.Lists.keys()),\n        });\n        localStorage.setItem('my-kanban-board', kanbanStr);\n    }\n    tryLoadFromLocalStorage() {\n        const boardDataStr = localStorage.getItem('my-kanban-board');\n        if (!boardDataStr) {\n            return;\n        }\n        const boardData = JSON.parse(boardDataStr);\n        this.currentTaskIndex = boardData.index;\n        boardData.tasks.forEach((item) => this.tasks.set(item[0], task_1.TaskItem.fromLoadedData(item[1])));\n        boardData.taskLists.forEach((list) => this.cardHandler.push(new cardlist_1.CardList(list, listNameToID(list))));\n        (0, layout_1.generateElementsForLoadedData)(this);\n    }\n    tryAddNewList() {\n        return this.cardHandler.tryAddNewList();\n    }\n    taskListContains(identifier) {\n        return this.cardHandler.Lists.has(identifier);\n    }\n    renameTaskList(oldID, newID) {\n        this.cardHandler.renameTaskList(oldID, newID);\n    }\n    deleteTaskList(identifier) {\n        this.cardHandler.removeWithID(identifier);\n    }\n    addNewTask(createdAt, listID, title, tag, dueDate, color, description) {\n        this.tasks.set(this.currentTaskIndex, new task_1.TaskItem(this.currentTaskIndex, createdAt, listID, title, tag, dueDate, color, description));\n        this.advanceTask();\n    }\n    getTaskFromID(identifier) {\n        const indexStr = identifier.lastIndexOf('-') + 1;\n        const taskIndex = +identifier.slice(indexStr);\n        const task = this.tasks.get(taskIndex);\n        if (!task) {\n            console.log(identifier);\n            throw new Error(`Fatal task fetch error. Tried to fetch item with index: ${taskIndex}`);\n        }\n        return task;\n    }\n    advanceTask() {\n        this.currentTaskIndex += 1;\n    }\n}\nexports.API = API;\nfunction listNameToID(value) {\n    let newName = new String(value);\n    newName = newName.replace(' ', '-').toLocaleLowerCase().concat('-list');\n    return newName.toString();\n}\nexports.listNameToID = listNameToID;\n\n\n//# sourceURL=webpack://kanban-board/./src/api.js?");

/***/ }),

/***/ "./src/cardhandler.js":
/*!****************************!*\
  !*** ./src/cardhandler.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CardHandler = void 0;\nconst api_1 = __webpack_require__(/*! ./api */ \"./src/api.js\");\nconst cardlist_1 = __webpack_require__(/*! ./cardlist */ \"./src/cardlist.js\");\nclass CardHandler {\n    get HasDefault() {\n        return this.hasDefault;\n    }\n    get Lists() {\n        return this.lists;\n    }\n    constructor() {\n        this.hasDefault = false;\n        this.lists = new Map();\n    }\n    push(card) {\n        this.lists.set(card.Identifier, card);\n    }\n    tryAddNewList() {\n        if (this.lists.has('New List')) {\n            return false;\n        }\n        this.lists.set('New List', new cardlist_1.CardList('New List', 'new-list'));\n        return true;\n    }\n    removeWithID(identifier) {\n        for (let [id, list] of this.lists.entries()) {\n            if (list.ElementID === identifier) {\n                this.lists.delete(id);\n                return;\n            }\n        }\n    }\n    renameTaskList(oldID, newID) {\n        const oldCard = this.lists.get(oldID);\n        if (oldCard) {\n            this.lists.delete(oldID);\n            this.lists.set(newID, oldCard);\n            return;\n        }\n        this.lists.set(newID, new cardlist_1.CardList(newID, (0, api_1.listNameToID)(newID)));\n    }\n}\nexports.CardHandler = CardHandler;\n\n\n//# sourceURL=webpack://kanban-board/./src/cardhandler.js?");

/***/ }),

/***/ "./src/cardlist.js":
/*!*************************!*\
  !*** ./src/cardlist.js ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CardList = void 0;\nclass CardList {\n    get Identifier() {\n        return this.identifier;\n    }\n    get ElementID() {\n        return this.elementID;\n    }\n    constructor(identifier, elementID) {\n        this.identifier = identifier;\n        this.elementID = elementID;\n    }\n}\nexports.CardList = CardList;\n\n\n//# sourceURL=webpack://kanban-board/./src/cardlist.js?");

/***/ }),

/***/ "./src/dragging.js":
/*!*************************!*\
  !*** ./src/dragging.js ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.setupListDragZone = exports.setupDraggables = void 0;\nconst layout_1 = __webpack_require__(/*! ./layout */ \"./src/layout.js\");\nfunction setupDraggables(api) {\n    const dragables = document.querySelectorAll('.task');\n    const droppables = document.querySelectorAll('.swim-list');\n    dragables.forEach((task) => (0, layout_1.addDragListeners)(task));\n    droppables.forEach((zone) => setupListDragZone(api, zone));\n}\nexports.setupDraggables = setupDraggables;\nfunction setupListDragZone(api, zone) {\n    zone.addEventListener('dragover', (e) => {\n        e.preventDefault();\n        const bottomTask = insertAboveTask(zone, e.clientY);\n        const currentTask = document.querySelector('.is-dragging');\n        const taskItem = api.getTaskFromID(currentTask.id);\n        taskItem.setListID(zone.id);\n        if (!bottomTask) {\n            zone.appendChild(currentTask);\n        }\n        else {\n            zone.insertBefore(currentTask, bottomTask);\n        }\n    });\n}\nexports.setupListDragZone = setupListDragZone;\nfunction insertAboveTask(zone, mouseY) {\n    // Grab all tasks that aren't currently being dragged\n    const els = zone.querySelectorAll('.task:not(.is-dragging)');\n    let closestTask = null;\n    let closestOffset = Number.NEGATIVE_INFINITY;\n    els.forEach((task) => {\n        const { top } = task.getBoundingClientRect();\n        const offset = mouseY - top;\n        if (offset < 0 && offset > closestOffset) {\n            closestOffset = offset;\n            closestTask = task;\n        }\n    });\n    return closestTask;\n}\n\n\n//# sourceURL=webpack://kanban-board/./src/dragging.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst api_1 = __webpack_require__(/*! ./api */ \"./src/api.js\");\nconst dragging_1 = __webpack_require__(/*! ./dragging */ \"./src/dragging.js\");\nconst layout_1 = __webpack_require__(/*! ./layout */ \"./src/layout.js\");\n// 30 seconds\nconst serialiseInterval = 10 * 1000;\nfunction main() {\n    const api = new api_1.API();\n    api.tryLoadFromLocalStorage();\n    setInterval(() => api.serializeToLocalStorage(), serialiseInterval);\n    (0, layout_1.setupAddTask)(api);\n    (0, layout_1.setupListAddButton)(api);\n    (0, dragging_1.setupDraggables)(api);\n    (0, layout_1.setupErrorModalLayout)();\n    (0, layout_1.setupModalLayout)();\n}\nwindow.addEventListener('load', main);\n\n\n//# sourceURL=webpack://kanban-board/./src/index.js?");

/***/ }),

/***/ "./src/layout.js":
/*!***********************!*\
  !*** ./src/layout.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.generateElementsForLoadedData = exports.setupNewTaskModalFields = exports.setupAddTask = exports.showErrorModal = exports.addDragListeners = exports.setupModalLayout = exports.setupErrorModalLayout = exports.setupListAddButton = void 0;\nconst api_1 = __webpack_require__(/*! ./api */ \"./src/api.js\");\nconst dragging_1 = __webpack_require__(/*! ./dragging */ \"./src/dragging.js\");\nconst task_1 = __webpack_require__(/*! ./task */ \"./src/task.js\");\nfunction setupListAddButton(api) {\n    const btn = document.querySelector('#list-add-btn');\n    btn.onclick = () => {\n        const listDiv = document.querySelector('#task-lists');\n        const listEl = createDefaultList(api);\n        if (!listEl) {\n            showErrorModal('Cannot create default list, as one already exists.');\n            return;\n        }\n        listDiv.insertBefore(listEl, listDiv.children[listDiv.children.length - 1]);\n    };\n}\nexports.setupListAddButton = setupListAddButton;\nfunction setupErrorModalLayout() {\n    const modal = document.querySelector('#error-modal');\n    const close = document.querySelector('#error-modal-close');\n    close.onclick = function (e) {\n        e.preventDefault();\n        modal.style.display = 'none';\n    };\n}\nexports.setupErrorModalLayout = setupErrorModalLayout;\nfunction setupModalLayout() {\n    // Get the modal\n    const modal = document.querySelector('#modal');\n    const modalHeader = document.querySelector('#modal-header');\n    // Get the <span> element that closes the modal\n    const span = document.querySelector('#close');\n    const colorSelected = document.querySelector('#color-selected');\n    const firstStyle = colorSelected.options[0].style;\n    colorSelected.value = firstStyle.backgroundColor;\n    colorSelected.style.background = firstStyle.backgroundColor;\n    // When the user clicks on <span> (x), close the modal\n    span.onclick = function () {\n        modal.style.display = 'none';\n    };\n    colorSelected.onchange = function () {\n        let color = colorSelected.options[colorSelected.selectedIndex].style.backgroundColor;\n        colorSelected.style.backgroundColor = color;\n        modalHeader.style.backgroundColor = color;\n    };\n}\nexports.setupModalLayout = setupModalLayout;\nfunction addDragListeners(el) {\n    el.addEventListener('dragstart', () => {\n        el.classList.add('is-dragging');\n    });\n    el.addEventListener('dragend', () => {\n        el.classList.remove('is-dragging');\n    });\n}\nexports.addDragListeners = addDragListeners;\nfunction showErrorModal(message) {\n    const errorModal = document.querySelector('#error-modal');\n    const modalText = document.querySelector('#error-modal-text');\n    modalText.innerText = message;\n    errorModal.style.display = 'block';\n}\nexports.showErrorModal = showErrorModal;\nfunction setupAddTask(api) {\n    const form = document.querySelector('#add-task-btn');\n    form.onclick = (e) => {\n        e.preventDefault();\n        const lists = document.querySelectorAll('.swim-list');\n        if (lists.length === 0) {\n            showErrorModal('No lists available to add a task.');\n            return;\n        }\n        const modal = document.querySelector('#modal');\n        modal.style.display = 'block';\n        setupNewTaskModalFields(api);\n    };\n}\nexports.setupAddTask = setupAddTask;\nfunction setupNewTaskModalFields(api) {\n    const modal = document.querySelector('#modal');\n    const modalHeader = document.querySelector('#modal-header');\n    const createdOn = document.querySelector('#created-on');\n    const taskTitle = document.querySelector('#task-title');\n    const taskDesc = document.querySelector('#task-desc');\n    const saveBtn = document.querySelector('#modal-save-btn');\n    const tagKind = document.querySelector('#kind-option');\n    tagKind.value = 'prg';\n    const dueDate = document.querySelector('#due-date');\n    dueDate.valueAsDate = null;\n    const colorSelected = document.querySelector('#color-selected');\n    const firstStyle = colorSelected.options[0].style;\n    colorSelected.value = firstStyle.backgroundColor;\n    colorSelected.style.background = firstStyle.backgroundColor;\n    modalHeader.style.backgroundColor = colorSelected.value;\n    const taskTitleText = `Task Title #${api.CurrentTaskIndex + 1}`;\n    taskTitle.value = taskTitleText;\n    taskDesc.value = '';\n    const date = new Date();\n    modal.style.display = 'block';\n    createdOn.innerText = `Created on ${date.toDateString()}`;\n    saveBtn.onclick = () => {\n        if (taskTitle.value === taskTitleText) {\n            showErrorModal('Invalid title name.');\n            return;\n        }\n        // Add to todo list\n        const list = document.querySelectorAll('.swim-list')[0];\n        const taskEl = createTaskItemElement(api, taskTitle.value, api.CurrentTaskIndex);\n        list.appendChild(taskEl);\n        const tagKind = document.querySelector('#kind-option');\n        const dueDate = document.querySelector('#due-date');\n        const colorSelected = document.querySelector('#color-selected');\n        api.addNewTask(date, list.id, taskTitle.value, (0, task_1.tagStrToKind)(tagKind.value), dueDate.valueAsDate, colorSelected.style.background, taskDesc.value);\n        // Hide modal\n        modal.style.display = 'none';\n    };\n}\nexports.setupNewTaskModalFields = setupNewTaskModalFields;\nfunction generateElementsForLoadedData(api) {\n    const listDiv = document.querySelector('#task-lists');\n    // Generate all list elements\n    api.TaskLists.forEach((list) => {\n        const listEl = createListWithName(api, list.Identifier);\n        listDiv.insertBefore(listEl, listDiv.children[listDiv.children.length - 1]);\n    });\n    // Generate all task elements\n    api.Tasks.forEach((task) => {\n        const list = document.querySelector(`#${task.ListID}`);\n        list.appendChild(createTaskItemElement(api, task.Title, task.ID));\n    });\n}\nexports.generateElementsForLoadedData = generateElementsForLoadedData;\nfunction populateTaskModalFields(api, taskID) {\n    const task = api.getTaskFromID(taskID);\n    const modal = document.querySelector('#modal');\n    const modalHeader = document.querySelector('#modal-header');\n    const createdOn = document.querySelector('#created-on');\n    const taskTitle = document.querySelector('#task-title');\n    const saveBtn = document.querySelector('#modal-save-btn');\n    const taskDesc = document.querySelector('#task-desc');\n    const tagKind = document.querySelector('#kind-option');\n    const dueDate = document.querySelector('#due-date-option');\n    const colorSelected = document.querySelector('#color-selected');\n    const taskTitleText = task.Title;\n    taskTitle.value = taskTitleText;\n    taskDesc.value = task.Description;\n    createdOn.innerText = `Created on ${task.CreatedAt.toDateString()}`;\n    tagKind.value = (0, task_1.tagKindToStr)(task.Tag);\n    dueDate.valueAsDate = task.DueDate;\n    modalHeader.style.background = task.Color;\n    colorSelected.value = task.Color;\n    colorSelected.style.background = task.Color;\n    saveBtn.onclick = () => {\n        task.applyFields(taskTitle.value, (0, task_1.tagStrToKind)(tagKind.value), dueDate.valueAsDate, colorSelected.style.background, taskDesc.value);\n        // Hide modal\n        modal.style.display = 'none';\n    };\n    // Show modal\n    modal.style.display = 'block';\n}\nfunction createTaskItemElement(api, taskTitle, index) {\n    /**\n     * <div class=\"task\" draggable=\"true\">\n            <p class=\"task-title\">Get Groceries</p>\n            <button class=\"task-edit\">...</button>\n        </div>\n     */\n    const taskID = `task-id-${index}`;\n    const newTask = document.createElement('div');\n    newTask.className = 'task';\n    newTask.id = taskID;\n    newTask.setAttribute('draggable', 'true');\n    const taskTitleEl = document.createElement('p');\n    newTask.appendChild(taskTitleEl);\n    taskTitleEl.className = 'task-title';\n    taskTitleEl.innerText = taskTitle;\n    const innerBtn = document.createElement('button');\n    newTask.appendChild(innerBtn);\n    innerBtn.className = 'task-edit';\n    innerBtn.innerText = '...';\n    innerBtn.onclick = () => populateTaskModalFields(api, taskID);\n    addDragListeners(newTask);\n    return newTask;\n}\nfunction createDefaultList(api) {\n    if (!api.tryAddNewList()) {\n        return null;\n    }\n    return createListWithName(api, 'New List');\n}\nfunction createListWithName(api, title) {\n    /**\n     * <div class=\"swim-list\" id=\"todo-list\">\n            <input class=\"list-heading\" type=\"text\">TODO</h3>\n        </div>\n     */\n    const el = document.createElement('div');\n    el.className = 'swim-list';\n    el.id = (0, api_1.listNameToID)(title);\n    const header = document.createElement('div');\n    el.appendChild(header);\n    header.className = 'list-heading-inner-text';\n    const headerTitle = document.createElement('input');\n    header.appendChild(headerTitle);\n    headerTitle.className = 'list-heading-input';\n    headerTitle.type = 'text';\n    headerTitle.value = title;\n    headerTitle.defaultValue = title;\n    headerTitle.onchange = (e) => listHeaderChange(el, headerTitle, e, api);\n    const deleteSpan = document.createElement('span');\n    header.appendChild(deleteSpan);\n    deleteSpan.className = 'list-delete-span';\n    deleteSpan.innerText = '\\u{00D7}';\n    deleteSpan.onclick = (e) => {\n        e.preventDefault();\n        if (el.children.length > 1) {\n            showErrorModal('Cannot delete list that contains tasks.');\n            return;\n        }\n        api.deleteTaskList(el.id);\n        const listDiv = document.querySelector('#task-lists');\n        listDiv.removeChild(el);\n    };\n    (0, dragging_1.setupListDragZone)(api, el);\n    return el;\n}\nfunction listHeaderChange(el, self, e, api) {\n    e.preventDefault();\n    const newID = (0, api_1.listNameToID)(self.value);\n    if (el.id === newID) {\n        return;\n    }\n    if (api.taskListContains(self.value)) {\n        showErrorModal(`Task list with name '${self.value}' already exists.`);\n        self.value = self.defaultValue;\n        return;\n    }\n    api.renameTaskList(self.defaultValue, self.value);\n    self.defaultValue = self.value;\n    el.id = newID;\n}\n\n\n//# sourceURL=webpack://kanban-board/./src/layout.js?");

/***/ }),

/***/ "./src/task.js":
/*!*********************!*\
  !*** ./src/task.js ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.tagKindToStr = exports.tagStrToKind = exports.TaskItem = exports.TagKind = void 0;\nvar TagKind;\n(function (TagKind) {\n    TagKind[TagKind[\"Programming\"] = 0] = \"Programming\";\n    TagKind[TagKind[\"Graphics\"] = 1] = \"Graphics\";\n    TagKind[TagKind[\"Documentation\"] = 2] = \"Documentation\";\n})(TagKind || (exports.TagKind = TagKind = {}));\nclass TaskItem {\n    // Properties\n    get ID() {\n        return this.id;\n    }\n    get CreatedAt() {\n        return this.createdAt;\n    }\n    get ListID() {\n        return this.listID;\n    }\n    get Title() {\n        return this.title;\n    }\n    get Tag() {\n        return this.tag;\n    }\n    get DueDate() {\n        return this.dueDate;\n    }\n    get Color() {\n        return this.color;\n    }\n    get Description() {\n        return this.description;\n    }\n    constructor(id, createdAt, listID, title, tag, dueDate, color, description) {\n        this.id = id;\n        this.createdAt = createdAt;\n        this.listID = listID;\n        this.title = title;\n        this.tag = tag;\n        this.dueDate = dueDate;\n        this.color = color;\n        this.description = description;\n    }\n    static fromLoadedData(item) {\n        return new TaskItem(item.id, new Date(item.createdAt), item.listID, item.title, item.tag, !item.dueDate ? null : new Date(item.dueDate), item.color, item.description);\n    }\n    setListID(listID) {\n        this.listID = listID;\n    }\n    applyFields(title, tag, dueDate, color, description) {\n        this.title = title;\n        this.tag = tag;\n        this.dueDate = dueDate;\n        this.color = color;\n        this.description = description;\n    }\n}\nexports.TaskItem = TaskItem;\nfunction tagStrToKind(tagStr) {\n    switch (tagStr) {\n        case 'prg':\n            return TagKind.Programming;\n        case 'gfx':\n            return TagKind.Graphics;\n        case 'doc':\n            return TagKind.Documentation;\n        default:\n            throw new Error(`Undefined tag kind '${tagStr}'`);\n    }\n}\nexports.tagStrToKind = tagStrToKind;\nfunction tagKindToStr(tag) {\n    switch (tag) {\n        case TagKind.Programming:\n            return 'prg';\n        case TagKind.Graphics:\n            return 'gfx';\n        case TagKind.Documentation:\n            return 'doc';\n    }\n}\nexports.tagKindToStr = tagKindToStr;\n\n\n//# sourceURL=webpack://kanban-board/./src/task.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;