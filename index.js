import Xstate from 'xstate'
const {Machine, interpret, send, actions} = Xstate
const {raise} = actions
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
          // why no infinite loop? because inactive is entered but toggle dosen't occur again. 
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

//output: 
// [
//   {
//     to: undefined,
//     type: 'xstate.send',
//     event: { type: 'TOGGLE' },
//     delay: undefined,
//     id: 'TOGGLE',
//     _event: {
//       name: 'TOGGLE',
//       data: [Object],
//       '$$type': 'scxml',
//       type: 'external'
//     }
//   }
// ]
// inactive
// active
// inactive