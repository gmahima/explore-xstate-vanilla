import Xstate from 'xstate'
const {Machine,interpret, actions} = Xstate
const {raise, respond, log, choose, send, assign, start} = actions

const toggleMachine = Machine({
    id: 'toggle',
    initial: 'inactive',
    states: {
        inactive: {
            on: {
                TOGGLE: {
                    target: 'active'
                }
            }
        },
        active: {
            activities: ['beeping'],
            on: {
                TOGGLE: {
                    target: 'inactive'
                }
            }
        }
    }
}, {
    activities: {
        beeping: () => {
            const interval = setInterval(() => console.log('beep'), 500)
            return () => clearInterval(interval) //cleanup
        }
    }
})

const service = interpret(toggleMachine).start().onTransition(s => console.log(s.value))
service.send('TOGGLE')
setTimeout(() => {
    service.send('TOGGLE')
    setTimeout(() => {
        service.send('TOGGLE')
        setTimeout((() => service.send('TOGGLE')), 5000)

    },5000)
}, 5000)
// output:
// inactive
// active
// beep
// beep
// beep
// beep
// beep
// beep
// beep
// beep
// beep
// inactive
// active
// beep
// beep
// beep
// beep
// beep
// beep
// beep
// beep
// beep
// inactive

// read restarting activities https://xstate.js.org/docs/guides/activities.html#restarting-activities