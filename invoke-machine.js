import Xstate from 'xstate'
const {Machine,interpret, actions} = Xstate
const {raise, respond, log, choose, send, assign, start} = actions
import fetch from 'node-fetch';

// If the state where the machine is invoked is exited, the machine is stopped.

const timerMachine = Machine({
    id: 'timer',
    context: {
        duration: 1000
    },
    initial: 'active',
    states: {
        active: {
            after: {
                CUSTOM_DURATION: 'finished'
            }
        },
        finished: {
            type: 'final'
        }
    }
}, {
    delays: {
        CUSTOM_DURATION: (context, event) => {
            return context.duration
        }
    }
})

const parentMachine = Machine({
    id: 'parent',
    initial: 'pending',
    context: {
        customDuration: 5000
    },
    states: {
        pending: {
            invoke: {
                id: 'timer',
                src: timerMachine,
                // The onDone transition will be taken when the
                // minuteMachine has reached its top-level final state.
                data: {
                    duration: (context, event) => {
                        console.log(event.type, " logged twice. why? ") // xstate.init
                        return context.customDuration
                    }
                },
                onDone: {
                    target: 'timeIsUp'
                }
            }
        },
        timeIsUp: {
            type: 'final'
        }
    }
})

const service = interpret(parentMachine)
service.onTransition(s => {
    console.log(s.value)
}).start()

// output: 
// xstate.init  logged twice. why? 
// xstate.init  logged twice. why? (maybe because both parent, child are reading ? -\__O__/-)
// pending
// after 5s : 
// timeIsUp