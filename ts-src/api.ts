import { CardHandler } from './cardhandler';
import { CardList } from './cardlist';
import { generateElementsFromLoadedData } from './layout';
import { Color, DueDate, TagKind, TaskItem } from './task';

interface KanbanBoardData {
    index: number;
    tasks: [number, TaskItem][];
    taskLists: string[];
}

export class API {
    private currentTaskIndex: number;
    private tasks: Map<number, TaskItem>;
    private cardHandler: CardHandler;

    get Tasks(): Map<number, TaskItem> {
        return this.tasks;
    }

    get TaskLists(): Array<CardList> {
        return Array.from(this.cardHandler.Lists.values());
    }

    get CurrentTaskIndex(): number {
        return this.currentTaskIndex;
    }

    constructor() {
        this.currentTaskIndex = 0;
        this.tasks = new Map();
        this.cardHandler = new CardHandler();
    }

    public serializeToLocalStorage() {
        const kanbanStr = JSON.stringify({
            index: this.currentTaskIndex,
            tasks: Array.from(this.tasks.entries()),
            taskLists: Array.from(this.cardHandler.Lists.keys()),
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
        boardData.taskLists.forEach((list) =>
            this.cardHandler.push(new CardList(list, listNameToID(list)))
        );

        this.cardHandler.setHasDefault();

        generateElementsFromLoadedData(this);
    }

    public removeTaskItem(item: TaskItem) {
        this.tasks.delete(item.ID);
    }

    public tryAddNewList(): boolean {
        return this.cardHandler.tryAddNewList();
    }

    public taskListContains(identifier: string): boolean {
        return this.cardHandler.Lists.has(identifier);
    }

    public renameTaskList(oldID: string, newID: string) {
        this.cardHandler.renameTaskList(oldID, newID);
        this.cardHandler.setHasDefault();
    }

    public deleteTaskList(identifier: string) {
        this.cardHandler.removeWithID(identifier);
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

export function listNameToID(value: string): string {
    let newName = new String(value);
    newName = newName.replace(' ', '-').toLocaleLowerCase().concat('-list');
    return newName.toString();
}
