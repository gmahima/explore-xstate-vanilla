import Xstate from 'xstate'
const {Machine, interpret, send, actions, forwardTo} = Xstate
const {raise, respond} = actions

function alertService (_, receive) {
    receive(event => {
        if(event.type === 'ALERT') {
            console.log(event.message)
        }
    })

}

const parentMachine = Machine({
    id: 'parent',
    initial: 'one',
    states: {
        one: {}
    },
    invoke: {
        id: 'alerter',
        src: () => alertService
    },
    on: {
        ALERT: {
            actions: forwardTo('alerter')
        }
    }
})

const parentService = interpret(parentMachine).start()
parentService.send('ALERT', 
    {
        message: "Hello there"
    } // obj is payload of event
)