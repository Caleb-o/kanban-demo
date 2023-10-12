import { generateElementsForLoadedData } from './layout';
import { Color, DueDate, TagKind, TaskItem } from './task';

interface KanbanBoardData {
    index: number;
    tasks: [number, TaskItem][];
    taskLists: string[];
}

export class API {
    private currentTaskIndex: number;
    private tasks: Map<number, TaskItem>;
    private taskLists: Set<string>; // TODO: Refactor to type

    get Tasks(): Map<number, TaskItem> {
        return this.tasks;
    }

    get TaskLists(): Set<string> {
        return this.taskLists;
    }

    get CurrentTaskIndex(): number {
        return this.currentTaskIndex;
    }

    constructor() {
        this.currentTaskIndex = 0;
        this.tasks = new Map();
        this.taskLists = new Set();
    }

    public serializeToLocalStorage() {
        const kanbanStr = JSON.stringify({
            index: this.currentTaskIndex,
            tasks: Array.from(this.tasks.entries()),
            taskLists: Array.from(this.taskLists),
        });
        localStorage.setItem('my-kanban-board', kanbanStr);
    }

    public tryLoadFromLocalStorage() {
        const boardDataStr = localStorage.getItem('my-kanban-board');
        if (!boardDataStr) {
            return;
        }

        const boardData: KanbanBoardData = JSON.parse(boardDataStr);
        this.currentTaskIndex = boardData.index;

        boardData.tasks.forEach((item) =>
            this.tasks.set(item[0], TaskItem.fromLoadedData(item[1]))
        );
        boardData.taskLists.forEach((list) => this.taskLists.add(list));

        generateElementsForLoadedData(this);
    }

    public tryAddNewList(): boolean {
        if (this.taskLists.has('New List')) {
            return false;
        }
        this.taskLists.add('New List');
        return true;
    }

    public taskListContains(identifier: string): boolean {
        return this.taskLists.has(identifier);
    }

    public renameTaskList(oldID: string, newID: string) {
        if (this.taskLists.has(oldID)) {
            this.taskLists.delete(oldID);
        }
        this.taskLists.add(newID);
    }

    public deleteTaskList(identifier: string) {
        this.taskLists.delete(identifier);
    }

    public addNewTask(
        createdAt: Date,
        listID: string,
        title: string,
        tag: TagKind,
        dueDate: DueDate,
        color: Color,
        description: string
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

    public getTaskFromID(identifier: string): TaskItem {
        const indexStr = identifier.lastIndexOf('-') + 1;
        const taskIndex = +identifier.slice(indexStr);
        const task = this.tasks.get(taskIndex);
        if (!task) {
            console.log(identifier);
            throw new Error(`Fatal task fetch error. Tried to fetch item with index: ${taskIndex}`);
        }
        return task;
    }

    private advanceTask() {
        this.currentTaskIndex += 1;
    }
}
