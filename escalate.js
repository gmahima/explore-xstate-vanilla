import Xstate from 'xstate';
const { createMachine, interpret, send, actions } = Xstate
const { escalate } = actions;

const childMachine = createMachine({
    id: 'child',
    initial: 'one',
    states: {
        one: {}
    },
    //reminder: entry will contain actions to execute on entry. 'actions' property used for event based actions
    entry: escalate({message: "sent to parent"})
});

const parentMachine = createMachine({
    id: 'parent',
    initial: 'one',
    states: {
        one: {}
    },
    invoke: {
        src: childMachine,
        onError: {
            actions: (context, event) => {
                console.log(event) // xstate.error event is received with payload: data: message:
                // { type: 'xstate.error', data: { message: 'sent to parent' } }
            }
        }
    }
});

const service = interpret(parentMachine).start()