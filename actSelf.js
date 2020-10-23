import Xstate from 'xstate'
const {Machine, interpret, send, actions} = Xstate
const {raise, respond, log} = actions


const counterMachine = Machine({
    id: 'counter',
    initial: 'counting',
    states: {
      counting: {
        entry: 'enterCounting',
        exit: 'exitCounting',
        on: {
          // self-transitions
          INC: { actions: 'increment' }, // internal (implicit)
          DEC: { target: 'counting', actions: 'decrement' }, // external
          DO_NOTHING: { internal: true, actions: 'logNothing' } // internal (explicit)
        }
      }
    }
  });
  
  // External transition (exit + transition actions + entry)
  const stateA = counterMachine.transition('counting', 'DEC');
  console.log(stateA.actions);
  // ['exitCounting', 'decrement', 'enterCounting']
  
  // Internal transition (transition actions)
  const stateB = counterMachine.transition('counting', 'DO_NOTHING');
  console.log(stateB.actions);
  // ['logNothing']
  
  const stateC = counterMachine.transition('counting', 'INC');
  console.log(stateC.actions);
  // ['increment']