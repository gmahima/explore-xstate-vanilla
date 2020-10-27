# Guarded Transition
a transition with condition(s)
A **Guard - condition function** 
* is specified on ```cond``` property of a transition as a - string or obj with ```{type:'...' }```
* definition: a function that takes in args: ```(context, event, condMeta)```
* condMeta: obj -  
    ```js
    {
        cond: {type: 'sdfasd', ...}, // original cond object
        state: {...}, // current machine state (before transition)
        _event: {...} //scxml event
    }
    ```
* returns true/false

// see actions.md -> assign for notes