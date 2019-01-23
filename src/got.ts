import { cloneDeep } from 'lodash';

export const got = (state?) => {
    return new Got(state);
};

class Got {
    public state: GotState;
    [id: string]: any;
    private predicates: any = {};

    constructor(state?: GotState) {
        this.state = state ? cloneDeep(state) : { entities: {}, triples: [] };
        this.state.entities = this.state.entities || {};
        this.state.triples = this.state.triples || [];
    }

    public predicate(name: string, objectType: string): Got {
        this.predicates[name] = new GotOperator(this.state, objectType);
        this.predicates[name].fit(this.predicates);
        return this;
    }

    public put(entity: GotEntity): Got {
        this.state.entities[entity.id] = entity;
        return this;
    }

    public triple() {

    }
}

class GotOperator {

    private subject: string = '';

    constructor(private state: GotState, private objectType: string = '') {}

    public put(entity: GotEntity) {
        this.state.entities[entity.id] = entity;
        if (this.objectType && this.subject) {
            this.state.triples.push({
                subject: this.subject,
                predicate: 'contains',
                object: entity.id,
                objectType: this.objectType,
            });
        }
        return this;
    }

    public fit(predicates: any): GotOperator {
        return Object.assign(this, predicates);
    }

    public setSubject(subject: string): GotOperator {
        this.subject = subject;
        return this;
    }
}

interface GotState {
    entities: { [id: string]: GotEntity };
    triples: GotTriple[];
}

interface GotEntity {
    id: string;
    name?: string;
}

interface GotEdge {
    id?: string;
    [id: string]: string;
}

interface GotTriple {
    subject: string;
    predicate: string;
    object: string;

    subjectType?: string;
    objectType?: string;
}

function last<T>(arr: T[]): T {
    return arr[arr.length - 1];
}