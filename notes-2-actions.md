## choose action
tells which action to execute based on some conditions

## assign
* Assignments can be stacked, and will run sequentially:
    ```js
    // ...
    actions: [
        assign({ count: 3 }), // context.count === 3
        assign({ count: context => context.count * 2 }) // context.count === 6
    ],
    // ...
    ```
* Custom actions are always executed with regard to the next state in the transition. When a state transition has assign(...) actions, those actions are always batched and computed first, to determine the next state. This is because a state is a combination of the finite state and the extended state (context).
    ```js
    const counterMachine = Machine({
    id: 'counter',
    context: { count: 0 },
    initial: 'active',
    states: {
        active: {
        on: {
            INC_TWICE: {
            actions: [
                (context) => console.log(`Before: ${context.count}`),
                assign({ count: (context) => context.count + 1 }), // count === 1
                assign({ count: (context) => context.count + 1 }), // count === 2
                (context) => console.log(`After: ${context.count}`)
            ]
            }
        }
        }
    }
    });

    interpret(counterMachine).send('INC_TWICE');
    // => "Before: 2"
    // => "After: 2"
    ```
    This is because both assign(...) actions are batched in order and executed first (in the microstep), so the next state context is { count: 2 }, which is passed to both custom actions. Another way of thinking about this transition is reading it like:

    > When in the active state and the INC_TWICE event occurs, the next state is the active state with context.count updated, and then these custom actions are executed on that state.