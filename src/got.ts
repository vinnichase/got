
export const got = (state?) => {
    return Got(state);
};

// Helper Functions

const wrapWith =
    (wrapper: any) =>
        (stateTransition) => (...args) => wrapper(stateTransition(...args));
const applyStateTransition = wrapWith(Got);

// Expression Builder
function Got(state: GotState = { nodes: {}, edges: [] }): GotOperator {
    return {
        node:
            applyStateTransition((node: GotNode) =>
                ({ nodes: { ...state.nodes, [node.id]: node }, edges: state.edges }),
            ) as AddNode,
        edge:
            applyStateTransition((edge: GotEdge) =>
                ({ ...state, edges: [...state.edges, edge] }),
            ) as AddEdge,
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
