import { cloneDeep } from 'lodash';

export const got = (state?) => {
    return new Got(state);
};

class Got {
    public state: GotState;
    [id: string]: any;

    constructor(state?: GotState) {
        this.state = state ? cloneDeep(state) : { entities: {}, edges: {} };
        this.state.entities = this.state.entities || {};
        this.state.edges = this.state.edges || {};
    }

    public type(name: string): Got {
        this[name] = this.operator(name, 'typeof');
        return this.put({
            id: name,
            name,
        }).edge(name, name, 'type');
    }

    public put(entity: GotEntity): Got {
        this.state.entities[entity.id] = entity;
        return this;
    }

    public edge(from: string, to?: string, type: string = 'default', twoWay: boolean = false) {
        const edge: GotEdge = {
            [from]: to || null
        };
        if (twoWay && to) {
            edge[to] = from;
        }
        if (this.state.edges[type]) {
            this.state.edges[type].push(edge);
        } else {
            this.state.edges[type] = [edge];
        }
        return this;
    }

    private operator(id: string, type: string) {
        return {
            put: (entity: GotEntity) => {
                return this.put(entity).edge(id, entity.id, type);
            },
            get: (selector?: string) => {
                if (!selector) {
                } else {
                    return this.state.edges[type]
                        .filter(e => e[id])
                        .map(e => this.state.entities[e[id]]);
                }
            },
        }
    }
}

interface GotState {
    entities: { [id: string]: GotEntity };
    edges: { [type: string]: GotEdge[] };
}

interface GotEntity {
    id: string;
    name?: string;
}

interface GotEdge {
    id?: string;
    [id: string]: string;
}
