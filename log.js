import Xstate from 'xstate'
const {Machine, interpret, send, actions} = Xstate
const {raise, respond, log} = actions

const loggingMachine = Machine({
    id: 'logging',
    context: {
        count: 42
    },
    initial: 'start',
    states: {
        start: {
            entry: log('started'),
            on: {
                FINISH: {
                    target: 'end',
                    actions: log(
                        (context, event) => `count: ${context.count}, event: ${event.type}`, 'Finish Label'
                    )
                }
            }
        },
        end: {}
    }
})

// const endState = loggingMachine.transition('start', 'FINISH')
// console.log(endState.actions)
const service = interpret(loggingMachine).start()
service.send('FINISH')

// output: started
// Finish Label count: 42, event: FINISH

// choose action, pure action