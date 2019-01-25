
export const got = (state?) => {
    return Got(state);
};

const wrapStateTransitionWith =
    (wrapper: any) =>
        (stateTransition) => (...args) => wrapper(stateTransition(...args));
const applyStateTransition = wrapStateTransitionWith(Got);

const matchEdge = (edge: GotEdge, id: string, type: string): boolean =>
    edge.to === id && edge.fromType === type ||
    edge.from === id && edge.toType === type;
const getEdgeOppositeId = (edge: GotEdge, id: string): string =>
    edge.from === id ? edge.to : edge.to === id ? edge.from : undefined;

const getLensForState =
    (state: GotState): GetLens =>
        (id: string): GotLens => ({
            view: () => ({ ...state.nodes[id] }),
            list: (type: string) => state.edges
                .filter(edge => matchEdge(edge, id, type))
                .map(edge => getLensForState(state)(getEdgeOppositeId(edge, id))),
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

interface GotOperator {
    node: AddNode;
    edge: AddEdge;
    lens: GetLens;
    state: GetState;
}

type GetLenses = (type: string) => GotLens[];
type GetNode = () => GotNode;

interface GotLens {
    view: GetNode;
    list: GetLenses;
}

interface GotState {
    nodes: { [id: string]: GotNode };
    edges: GotEdge[];
}

interface GotNode {
    id: string;
    name?: string;
    [key: string]: any;
}

interface GotEdge {
    from: string;
    fromType: string;
    to: string;
    toType: string;
}
