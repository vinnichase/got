
export const got = (state?) => {
    return Got(state);
};

// Helper Functions

const wrapWith =
    (wrapper: any) =>
        (state: GotState) =>
            (stateTransition) => (...args) => wrapper(stateTransition(state, ...args));
const wrapWithGot = wrapWith(Got);

// Expression Builder
function Got(state: GotState = { nodes: {}, edges: [] }): GotOperator {
    const applyStateTransition = wrapWithGot(state);
    return {
        node:
            applyStateTransition((oldState: GotState, node: GotNode) =>
                ({ nodes: { ...oldState.nodes, [node.id]: node }, edges: oldState.edges }),
            ) as AddNode,
        edge:
            applyStateTransition((oldState: GotState, edge: GotEdge) =>
                ({ ...oldState, edges: [...oldState.edges, edge] }),
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
