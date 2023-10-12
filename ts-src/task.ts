export enum TagKind {
    Programming,
    Graphics,
    Documentation,
}

export type DueDate = Date | null;
export type Color = string;

export class TaskItem {
    private readonly id: number;
    private readonly createdAt: Date;

    private listID: string;
    private title: string;
    private tag: TagKind;
    private dueDate: DueDate;
    private color: Color;
    private description: string;

    // Properties
    get ID(): number {
        return this.id;
    }

    get CreatedAt(): Date {
        return this.createdAt;
    }

    get ListID(): string {
        return this.listID;
    }

    get Title(): string {
        return this.title;
    }

    get Tag(): TagKind {
        return this.tag;
    }

    get DueDate(): DueDate {
        return this.dueDate;
    }

    get Color(): Color {
        return this.color;
    }

    get Description(): string {
        return this.description;
    }

    constructor(
        id: number,
        createdAt: Date,
        listID: string,
        title: string,
        tag: TagKind,
        dueDate: DueDate,
        color: Color,
        description: string
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.listID = listID;
        this.title = title;
        this.tag = tag;
        this.dueDate = dueDate;
        this.color = color;
        this.description = description;
    }

    public static fromLoadedData(item: TaskItem): TaskItem {
        return new TaskItem(
            item.id,
            new Date(item.createdAt),
            item.listID,
            item.title,
            item.tag,
            !item.dueDate ? null : new Date(item.dueDate),
            item.color,
            item.description
        );
    }

    public setListID(listID: string) {
        this.listID = listID;
    }

    public applyFields(
        title: string,
        tag: TagKind,
        dueDate: DueDate,
        color: Color,
        description: string
    ) {
        this.title = title;
        this.tag = tag;
        this.dueDate = dueDate;
        this.color = color;
        this.description = description;
    }
}

export function tagStrToKind(tagStr: string): TagKind {
    switch (tagStr) {
        case 'prg':
            return TagKind.Programming;
        case 'gfx':
            return TagKind.Graphics;
        case 'doc':
            return TagKind.Documentation;
        default:
            throw new Error(`Undefined tag kind '${tagStr}'`);
    }
}

export function tagKindToStr(tag: TagKind): string {
    switch (tag) {
        case TagKind.Programming:
            return 'prg';
        case TagKind.Graphics:
            return 'gfx';
        case TagKind.Documentation:
            return 'doc';
    }
}
