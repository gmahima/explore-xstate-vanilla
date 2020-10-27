import Xstate from 'xstate'
const {Machine,interpret, actions} = Xstate
const {raise, respond, log, choose, send, assign, start} = actions

const createGlassMachine = (capacity) => {
    return Machine({
        id: 'glass',
        context: {
            capacity,
            volume: 0
        },
        initial: 'empty',
        states: {
            empty: {
                on: {
                    POUR: {
                        target: 'partial',
                        actions :'pourWater'
                    }
                }

            },
            partial: {
                always: {
                    target: 'full',
                    cond: {
                        type: 'isFull'
                    }
                },
                on: {
                    POUR: {
                        target: 'partial',
                        actions :'pourWater'
                    }
                }

            },
            full: {

            }
        }

    }, {
        actions: {
            pourWater: assign({
                volume: (context) => context.volume + 1
            })
            // pourWater: () => {
            //     assign({
            //         volume: (context) => context.volume + 1
            //     })
            //    // wont work since assign is not called now, it will just return action Object, to be called by interpretator. 
            // functions like assign which are just pure functions (which dont modify state (extended or not) directly) and return action objects that can be called are called
            // "ACTION CREATORS"
            // }
        },
        guards: {
            isFull: (context, event) => {
                return  context.capacity === context.volume
            }
        }
    })
}

const glassMachine = createGlassMachine(10)
const service = interpret(glassMachine).start().onTransition(s => console.log(s.context, s.value))
service.send('POUR')
service.send('POUR')
service.send('POUR')
service.send('POUR')
service.send('POUR')
service.send('POUR')
service.send('POUR')
service.send('POUR')
service.send('POUR')
service.send('POUR')


// output: 
// { capacity: 10, volume: 0 } empty
// { capacity: 10, volume: 1 } partial
// { capacity: 10, volume: 2 } partial
// { capacity: 10, volume: 3 } partial
// { capacity: 10, volume: 4 } partial
// { capacity: 10, volume: 5 } partial
// { capacity: 10, volume: 6 } partial
// { capacity: 10, volume: 7 } partial
// { capacity: 10, volume: 8 } partial
// { capacity: 10, volume: 9 } partial
// { capacity: 10, volume: 10 } full