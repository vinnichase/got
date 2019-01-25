
export const got = (state?) => {
    return Got(state);
};

const wrapStateTransitionWith =
    (wrapper: any) =>
        (stateTransition) => (...args) => wrapper(stateTransition(...args));
const applyStateTransition = wrapStateTransitionWith(Got);

const filterEdges = (edges: GotEdge[], id: string, type: string): GotEdge[] => edges.filter(edge =>
    edge.to === id && edge.fromType === type ||
    edge.from === id && edge.toType === type);
const getEdgeOppositeId = (edge: GotEdge, id: string): string =>
    edge && edge.from === id ? edge.to :
        edge && edge.to === id ? edge.from : undefined;

const getLensForState =
    (state: GotState): GetLens =>
        (id: string): GotLens => ({
            view: () => id ? { ...state.nodes[id] } : undefined,
            list: (type: string) => filterEdges(state.edges, id, type)
                .map(edge => getLensForState(state)(getEdgeOppositeId(edge, id))),
            first: (type: string) => getLensForState(state)(getEdgeOppositeId(
                filterEdges(state.edges, id, type)[0], id)),
        });

function Got(state: GotState = { nodes: {}, edges: [] }): GotOperator {
    return {
        node: applyStateTransition((node: GotNode) =>
            ({ nodes: { ...state.nodes, [node.id]: node }, edges: state.edges }),
        ) as AddNode,
        edge: applyStateTransition((edge: GotEdge) =>
            ({ ...state, edges: [...state.edges, edge] }),
        ) as AddEdge,
        lens: getLensForState(state),
        state: () => state,
    };
}

type AddNode = (node: GotNode) => GotOperator;
type AddEdge = (edge: GotEdge) => GotOperator;
type GetLens = (id: string) => GotLens;
type GetState = () => GotState;

export interface GotOperator {
    node: AddNode;
    edge: AddEdge;
    lens: GetLens;
    state: GetState;
}

type GetLenses = (type: string) => GotLens[];
type GetNode = () => GotNode;

export interface GotLens {
    view: GetNode;
    list: GetLenses;
    first: (type: string) => GotLens;
}

export interface GotState {
    nodes: { [id: string]: GotNode };
    edges: GotEdge[];
}

export interface GotNode {
    id: string;
    name?: string;
    [key: string]: any;
}

export interface GotEdge {
    from: string;
    fromType: string;
    to: string;
    toType: string;
}
