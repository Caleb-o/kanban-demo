import { listNameToID } from './api';
import { CardList } from './cardlist';

export class CardHandler {
    private hasDefault: boolean;
    private lists: Map<string, CardList>;

    get HasDefault(): boolean {
        return this.hasDefault;
    }

    get Lists(): Map<string, CardList> {
        return this.lists;
    }

    constructor() {
        this.hasDefault = false;
        this.lists = new Map();
    }

    public push(card: CardList) {
        this.lists.set(card.Identifier, card);
    }

    public tryAddNewList(): boolean {
        if (this.lists.has('New List')) {
            return false;
        }
        this.lists.set('New List', new CardList('New List', 'new-list'));
        return true;
    }

    public removeWithID(identifier: string) {
        for (let [id, list] of this.lists.entries()) {
            if (list.ElementID === identifier) {
                this.lists.delete(id);
                return;
            }
        }
    }

    public renameTaskList(oldID: string, newID: string) {
        const oldCard = this.lists.get(oldID);
        if (oldCard) {
            this.lists.delete(oldID);
            this.lists.set(newID, oldCard);
            return;
        }

        this.lists.set(newID, new CardList(newID, listNameToID(newID)));
    }
}