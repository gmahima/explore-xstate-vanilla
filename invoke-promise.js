import Xstate from 'xstate'
const {Machine,interpret, actions} = Xstate
const {raise, respond, log, choose, send, assign, start} = actions
import fetch from 'node-fetch';
const fetchPokemon = () => (
    fetch("https://pokeapi.co/api/v2/pokemon/1/error")
  .then(response => response.json())

)// return fetch don't just call i.e. X {} X

const pokemonMachine = Machine({
    id: 'pokemon',
    initial: 'idle',
    context: {
        pokemon: undefined,
        error: undefined
    },
    states: {
        idle: {
            on: {
                FETCH: 'loading'
            }
        },
        loading: {
            invoke: {
                id: "getpokemon",
                src: () => fetchPokemon(),
                onDone: {
                    target: 'success',
                    actions: assign({
                        pokemon: (context, event) => {console.log(event); return event.data}
                    })
                },
                onError: {
                    target: 'failure',
                    actions: assign({
                        error: (context, event) => {console.log(event); return event.data}
                    })
                }
            }
        },
        success: {},
        failure: {
            on: {
                RETRY: 'loading'
            }
        }
    }
})

const service = interpret(pokemonMachine).start().onTransition(s => console.log(s.value))
service.send('FETCH')

// success op:

// *************** //

// idle
// loading
// {
//   type: 'done.invoke.getpokemon',
//   data: {
//     abilities: [ [Object], [Object] ],
//     base_experience: 64,
//     forms: [ [Object] ],
//     game_indices: [
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object], [Object],
//       [Object], [Object]
//     ],
//     height: 7,
//     held_items: [],
//     id: 1,
//     is_default: true,
//     location_area_encounters: 'https://pokeapi.co/api/v2/pokemon/1/encounters',
//     moves: [
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object], [Object], [Object],
//       [Object], [Object], [Object]
//     ],
//     name: 'bulbasaur',
//     order: 1,
//     species: {
//       name: 'bulbasaur',
//       url: 'https://pokeapi.co/api/v2/pokemon-species/1/'
//     },
//     sprites: {
//       back_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
//       back_female: null,
//       back_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png',
//       back_shiny_female: null,
//       front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
//       front_female: null,
//       front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
//       front_shiny_female: null,
//       other: [Object],
//       versions: [Object]
//     },
//     stats: [ [Object], [Object], [Object], [Object], [Object], [Object] ],
//     types: [ [Object], [Object] ],
//     weight: 69
//   },
//   toString: [Function (anonymous)]
// }
// success

// ========================================================== //

// failure op:

// *************** //

// idle
// loading
// {
//   type: 'error.platform.getpokemon',
//   data: FetchError: invalid json response body at https://pokeapi.co/api/v2/pokemon/1/error reason: Unexpected token N in JSON at position 0
//       at /Users/mahimagangavarapu/myProjects/learnXState/explore-xstate-vanilla/node_modules/node-fetch/lib/index.js:272:32
//       at processTicksAndRejections (internal/process/task_queues.js:93:5) {
//     type: 'invalid-json'
//   },
//   toString: [Function (anonymous)]
// }
// failure