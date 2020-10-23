import Xstate from 'xstate'
const {Machine} = Xstate
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

const actions = triggerMachine.transition('inactive', 'TRIGGER').actions
