import Xstate from 'xstate'
const {Machine, interpret, send} = Xstate
const triggerMachine = Machine(
    {
      id: 'trigger',
      initial: 'inactive',
      states: {
        inactive: {
          on: {
            TRIGGER: {
              target: 'active',
              // transition actions
              actions: ['activate', 'sendTelemetry']
            }
          }
        },
        active: {
          // entry actions
          entry: ['notifyActive', 'sendTelemetry'],
          // exit actions
          exit: ['notifyInactive', 'sendTelemetry'],
          on: {
            STOP: 'inactive'
          }
        }
      }
    },
    {
      actions: {
        // action implementations
        activate: (context, event) => {
          console.log('activating...');
        },
        notifyActive: (context, event) => {
          console.log('active!');
        },
        notifyInactive: (context, event) => {
          console.log('inactive!');
        },
        sendTelemetry: (context, event) => {
          console.log('time:', Date.now());
        }
      }
    }
);

const lazyStubbornMachine = Machine({
  id: 'stubborn',
  initial: 'inactive',
  states: {
    inactive:{
      on: {
        TOGGLE: {
          target: 'active',
          actions: send('TOGGLE')
        }
      }
    },
    active: {
      on: {
        TOGGLE: 'inactive'
      }
    }
  }
})

const nextState = lazyStubbornMachine.transition('inactive', 'TOGGLE')

console.log(nextState.actions)

const service = interpret(lazyStubbornMachine)
service.start().onTransition(state => console.log(state.value))

service.send('TOGGLE')
// inactive, active, inactive!! since, interpreter is calling send(toggle) from active because we defined in ln 55