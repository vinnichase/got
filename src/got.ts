
export const got = (state?) => {
    return Got(state);
};

// Helper Functions

const wrapStateTransitionWith =
    (wrapper: any) =>
        (stateTransition, cursor) => (...args) => wrapper(stateTransition(...args), cursor);
const applyStateTransition = wrapStateTransitionWith(Got);
const wrapQueryWith =
    (wrapper: any) =>
        (state: GotState) =>
            (query, cursor) => (...args) => wrapper(state, cursor);
const applyQuery = wrapQueryWith(Got);

// Expression Builder
function Got(state: GotState = { nodes: {}, edges: [] }, cursor: GotCursor = { nodes: [], edges: [] }) {
    const applyStateQuery = applyQuery(state);
    return {
        node:
            applyStateTransition(
                (node: GotNode) =>
                    ({ nodes: { ...state.nodes, [node.id]: node }, edges: state.edges }),
                cursor,
            ) as AddNode,
        edge:
            applyStateTransition(
                (edge: GotEdge) =>
                    ({ ...state, edges: [...state.edges, edge] }),
                cursor,
            ) as AddEdge,
        entry: '',
        state: () => state,
    };
}

type AddNode = (node: GotNode) => GotOperator;
type AddEdge = (edge: GotEdge) => GotOperator;

interface GotOperator {
    node: AddNode;
    edge: AddEdge;
    state: () => GotState;
}

interface GotCursor {
    nodes: GotNode[];
    edges: GotEdge[];
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
