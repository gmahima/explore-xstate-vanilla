import Xstate from 'xstate'
const {Machine, interpret, send, actions} = Xstate
const {raise, respond, log, choose} = actions

const sampleMachine = Machine({
    initial: 'one',
    states: {
        one: {
            entry: choose([
                {
                    cond: 'cond1',
                    actions: [
                        log('cond1 true')
                    ]
                },
                {
                    cond: 'cond2',
                    actions: [
                        log('cond2 true')
                    ]
                },
                {
                    cond: 'cond3',
                    actions: [
                        log('cond3 true')
                    ]
                }
            ])
        }
    }
}, {
    guards: {
        cond1: () => {
            return true
        },
        cond2: () => {
            return true
        },
        cond3: () => {
            return true
        }
    }
})
const service = interpret(sampleMachine)
service.start()

// output: cond1 true
// executes the first action whose conditon resolves to true