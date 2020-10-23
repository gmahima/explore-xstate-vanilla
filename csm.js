import Xstate from 'xstate'
const {Machine, interpret, send, actions} = Xstate
const {raise, respond} = actions

const authServerMachine = Machine({
    initial: 'waitingForCode',
    states: {
      waitingForCode: {
        on: {
          CODE: {
            actions: respond('TOKEN', { delay: 10 })
          }
        }
      }
    }
});
  
const authClientMachine = Machine({
initial: 'idle',
states: {
    idle: {
    on: { AUTH: 'authorizing' }
    },
    authorizing: {
    invoke: {
        id: 'auth-server',
        src: authServerMachine
    },
    entry: send('CODE', { to: 'auth-server' }),
    on: {
        TOKEN: 'authorized' // event sent by serverMachine
    }
    },
    authorized: {
    type: 'final'
    }
}
});

const service = interpret(authClientMachine)
service.start().onTransition(state => console.log(state.value))

service.send('AUTH')