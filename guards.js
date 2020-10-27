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
                        cond: {
                            type: 'searchValid',
                            minQueryLength: 3
                        }
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
        searchValid: (context, event, {cond}) => {
            return context.canSearch && event.query && event.query.length>cond.minQueryLength
        }
    }
})
// const service = interpret(searchMachine)
// service.start().onTransition(s => console.log(s.value))
// service.send({
//     type: "SEARCH",
//     query: "ad"

// })
const lightMachine = Machine({
    id: 'light',
    initial: 'green',
    states: {
      green: { on: { TIMER: 'yellow' } },
      yellow: { on: { TIMER: 'red' } },
      red: {
        initial: 'walk',
        states: {
          walk: {
            /* ... */
          },
          wait: {
            /* ... */
          },
          stop: {
            /* ... */
          }
        },
        on: {
          TIMER: [
            {
              target: 'green',
              in: '#light.red.stop' // in state gaurd. not recommended, but can be done. 
              // if any other conds, all must eval to true
            }
          ]
        }
      }
    }
  });