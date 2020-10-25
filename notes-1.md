# Machine
A finite set of states that can transition to each other based on events. 
**Machine() takes arg: config of the machine you want as an object. It is the definition of the machine**        
>note: machine.transition() is a pure function. dosen't do anything to the states. just takes in state, event as args and returns description of next state.

## interpret() 
Runs your machine with the config given in Machine(). 
* parses and executes machine in run time env. **creates an instance of machine**
* **an interpreted running instance of a machine is called a service**
* ```interpret(machine)``` - returns a *service*. 
* *machine - service* analogous to *class - object*
* actually **calls an action** -> **executes events** -> **causing effects** (actions, activities, invoking) & transitions
* ```service.start()``` - will call the service i.e. initialize it (action that causes an event that transitions machine to initial state) - transition the service to its initial state. 
* ```service.stop()``` - will remove all listeners from service and do listener cleanup. 

# State
* An abstract representation of a system at a point of time
* The system can be only in one state at a time. 

# Event
* can cause the machine to transition from one state to another.
* can cause the machine to run effects.
* some events do neither. 
**state cannot change without an event**
* internally converted to scxml events for compatability     
## event obj:
```
{
    type: 'ASDF',
    some_other_property: 'data associated with event'
}
```

# Transition
**don't confuse with event, effect**
caused by only events.
but, all events need not cause a transition. (forbidden transitions)
defines what the next state should be givent current state and event that occured. 

# Effects - (can send back events) - caused when an event happens
but, all events need not cause an action. (forbidden transitions)
## Fire and Forget (Sync)
execute a **sync side effect** with no event sent back to the state chart ex:console.log() *or* **send an event synchronously** back to the state chart

### action object: 
```
{
    type: 'type of action: ex: xstate.send() or a custom-defined one',
    event: {
        event obj
    } // the event that the action will cause when called.

}
```
## Invoked Effects (Async)
execute a side-effect that can **send and receive events** asynchronously

event can be caused without an action also. actions cant directly cause transitions. 
what is send() - send is an action

actions => cause events => events can cause => 1. transition
                                            => 2. action