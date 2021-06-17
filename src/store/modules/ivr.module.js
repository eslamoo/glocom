export default {
    state: {
        currentNode: {}
    },
    getters: {
        currentNode(state) {
            return state.currentNode
        },
    },
    mutations: {
        setCurrentNode(state, currentNode) {
            state.currentNode = currentNode
        }
    },
    actions: {}
}