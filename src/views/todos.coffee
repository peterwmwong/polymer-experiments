# Converts window.location.hash to acceptable `m-todos::filterOn` value.
HASH_TO_FILTER =
  '#/all': 'all'
  '#/active': 'active'
  '#/complete': 'complete'

Polymer 'todos',
  ready: ->
    # Listen for window.location.hash changes
    window.addEventListener 'hashchange', @updateFilterOn.bind(@)
    @updateFilterOn()

  ###
  Updates `m-todos::filterOn`...
  1. Initial boot up
  1. Whenever window.location.hash changes

  If the window.location.hash is NOT an acceptable value, default
  window.location.hash to '#/all'
  ###
  updateFilterOn: ->
    if @$.model.filterOn = HASH_TO_FILTER[window.location.hash]
      Platform.flush()
    else
      window.location.hash = '#/all'

  ###
  Creates a new todo, when the enter key is pressed and input
  is not empty.
  ###
  onNewTodoKeypress: ({which})->
    if which is 13 and @$.newTodo.value
      @$.model.items.push
        text: @$.newTodo.value
        done: false
      @$.newTodo.value = ''
