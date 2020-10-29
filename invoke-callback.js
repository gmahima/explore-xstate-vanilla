import Xstate from 'xstate'
const {Machine,interpret, actions} = Xstate
const {raise, respond, log, choose, send, assign, start} = actions
import fetch from 'node-fetch';

const pokemonMachine = Machine({
    id: 'pokemon',
    initial: 'counting',
    context: {
        counter: 0
    },
    states: {
        counting: {
            invoke: {
                // child service
              id: 'incInterval',
              src: (context, event) => (callback, onReceive) => {
                // This will send the 'INC' event to the parent every second
                const id = setInterval(() => callback('INC'), 1000);
          
                // Perform cleanup
                return () => clearInterval(id);
              }
            },
            on: {
              INC: { actions: assign({ counter: context => context.counter + 1 }) },
              STOP: 'stopped'
            }
        },
        stopped: {}
    }
})

// const service = interpret(pokemonMachine).start().onTransition(s => console.log(s.context))
// setTimeout(() => {service.send('STOP')}, 5000)
// output
// { counter: 0 }
// { counter: 1 }
// { counter: 2 }
// { counter: 3 }
// { counter: 4 }
// { counter: 4 }

const pingPongMachine = Machine({
    id: 'pinger',
    initial: 'active',
    states: {
        active: {
            entry: send('PING', {to: 'ponger'}),
            invoke: {
                id: 'ponger',
                src: (context, event) => (callback, onReceive) => {
                    // Whenever parent sends 'PING',
                    // send parent 'PONG' event
                    console.log('invoked')
                    onReceive(e => {
                        if(e.type === 'PING') {
                            callback('PONG')
                        }
                    }) // sets up a listener to listen to events 
                }
            },
            on: {
                PONG: {
                    actions: (context, event) => {
                    },
                    target: 'done'
                }
            }
        },
        done: {
            type: 'final'
        }
    }
})

const service = interpret(pingPongMachine).onTransition(s => console.log(s.value));
service.start()

// output: 
// invoked
// active
// done