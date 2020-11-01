import Xstate from 'xstate'
const {Machine,interpret, actions} = Xstate
const {raise, respond, log, choose, send, sendParent, assign, start} = actions
import fetch from 'node-fetch';

// If the state where the machine is invoked is exited, the machine is stopped.

const timerMachine = Machine({
    id: 'timer',
    context: {
        duration: 1000,
        message: "some msg from timer"
    },
    initial: 'active',
    states: {
        active: {
            after: {
                CUSTOM_DURATION: 'finished'
            }
        },
        finished: {
            type: 'final',
            data: {
                secret: (context, event) => {
                    console.log(context, "sdsgd")
                    console.log(event.type, "from timer")
                    console.log(context.message, " <- context.message?")
                    return "asdfassdf"
                }
            }
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
        customDuration: 5000,
        msgFromTimer: undefined
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
                    } // replaces context of timer completely. : see if ok, or find fix
                },
                onDone: {
                    target: 'timeIsUp',
                    actions: assign({
                        msgFromTimer: (context,event) => {
                            console.log(event.type, "from parnet")
                            console.log(event.data)
                            return event.data.secret
                        }
                    })
                }
            }
        },
        timeIsUp: {
            type: 'final'
        }
    }
})

// const service = interpret(parentMachine)
// service.onTransition(s => {
//     console.log(s.value, s.context)
// }).start()

// output

// xstate.init  logged twice. why? 
// xstate.init  logged twice. why? 
// pending { customDuration: 5000, msgFromTimer: undefined }
// { duration: 5000 } sdsgd
// xstate.after(CUSTOM_DURATION)#timer.active from timer
// undefined  <- context.message?
// done.invoke.timer from parnet
// { secret: 'asdfassdf' }
// timeIsUp { customDuration: 5000, msgFromTimer: 'asdfassdf' }
// Mahimas-MacBook-Air:explore-xstate-vanilla mahimagangavarapu$ 

const pongMachine  = Machine({
    initial: 'active',
    id: 'pong',
    states: {
        active: {
            on: {
                PING: {
                    actions: [
                        log(() => {return 'PONG'}, {delay: 1000}),
                        sendParent('PONG', {
                            delay: 1000
                        })
                        
                    ]
                }
            }
        }
    }
})

const pingMachine = Machine({
    id: 'ping',
    initial: 'active',
    states: {
        active: {
            invoke: {
                id: 'pong',
                src: pongMachine
            },
            entry: [
                log('PING, come first?'),
                send('PING', {to: 'pong'})
                
            ],
            on: {
                PONG: {
                    actions: [
                        log('PING', {delay: 1000}),
                        send('PING', {to: 'pong', delay: 1000})
                        
                    ]
                },
                STOP: {
                    target: 'inactive'
                }
            }
        },
        inactive: {
            type: 'final'
        }
    }
})



const service = interpret(pingMachine)
service.start()

const id = setTimeout(() => {service.send('STOP')}, 10000)
// output

// PING, come first?
// { delay: 1000 } PONG
// { delay: 1000 } PING
// { delay: 1000 } PONG
// { delay: 1000 } PING
// { delay: 1000 } PONG
// { delay: 1000 } PING
// { delay: 1000 } PONG
// { delay: 1000 } PING
// { delay: 1000 } PONG
// { delay: 1000 } PING

// hide delay in log
