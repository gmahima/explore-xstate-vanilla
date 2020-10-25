import { createMachine, actions } from 'xstate';

const { pure } = actions;

// Dynamically send an event to every invoked sample actor
const sendToAllSampleActors = pure((context, event) => {
  return context.sampleActors.map((sampleActor) => {
    return send('SOME_EVENT', { to: sampleActor });
  });
});
// => {
//   type: ActionTypes.Pure,
//   get: () => ... // evaluates to array of send() actions
// }

const machine = createMachine({
  // ...
  states: {
    active: {
      entry: sendToAllSampleActors
    }
  }
});

// come back to this after learning spawning.