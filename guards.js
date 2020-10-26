import Xstate from 'xstate'
const {Machine, interpret, send, actions} = Xstate
const {raise, respond, log, choose} = actions

const searchMachine = Machine({
    id: 'search',
    initial: 'idle',
    context: {
        canSearch: true
    },
    states: {
        idle: {
            initial: 'normal',
            states: {
                normal: {},
                invalid: {}
            },
            on: {
                SEARCH: [
                    {
                        target: 'searching',
                        cond: 'searchValid'
                    },
                    {
                        target: '.invalid'
                    }
                ]
            }
        },
        searching: {
            entry: log('should do search op')
        }
    }

}, {
    guards: {
        searchValid: (context, event) => {
            return context.canSearch && event.query && event.query.length>0
        }
    }
})
//see in visualizer. send event => 
// {
//     "type": "SEARCH",
//     "query": "asdf"
// }