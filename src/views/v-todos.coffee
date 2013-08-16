# Converts window.location.hash to acceptable `m-todos::filterOn` value.
HASH_TO_FILTER =
  '#/all': 'all'
  '#/active': 'active'
  '#/complete': 'complete'

v_todos =
  # Determines what items should be filtered on to populate
  # `@filtered` array.
  # Acceptable values: 'all', 'active', or 'complete'.
  filterOn: 'active'
  first:
    text: 'FIRST'

  ready: ->
    ###
    Update `@filtered` array whenever...
    1. `@items` array changes (add, delete, update)
    1. `@done` changes on an item in `@items`

    Platform Feature: ArrayReduction (mdv/third_party/ChangeSummary)
    ----------------------------------------------------------------
    
    Very cool utility to simplify...
    1. Reducing an Array based on a property on each item.
    1. Writing the reduced value to an Object.
    1. Updating the reduced value (reduce and write) whenever...
       1. the Array changes (add, delete, update)
       1. the property of an item changes.
    ###
    @computedReduction = ArrayReduction.defineProperty @, 'computed', 
      array: @$.model.items
      path: 'done'
      makeInitial: (prev)->
        prev or= {}
        prev.filtered = []
        prev.activeCount = 0
        prev.completedCount = 0
        prev
      reduce: @reduceComputed.bind @

    # Listen for window.location.hash changes
    window.addEventListener 'hashchange', @updateFilterOn.bind(@)
    @updateFilterOn()

  ###
  Updates `m-todos::filterOn`...
  1. Initial boot up
  1. Whenever window.location.hash changes

  If the window.location.hash is NOT an acceptable value, default
  window.location.hash to '#/active'
  ###
  updateFilterOn: ->
    unless @filterOn = HASH_TO_FILTER[window.location.hash]
      window.location.hash = '#/active'

  ###
  Reduces todo items to the ones that meet the `@filterOn` criteria.
  Expects to be called by `Array::reduce()` with an array of the `@done`
  attribute of each todo item.
  ###
  reduceComputed: (prev,currentDone,i)->
    # When the `@items` is empty, currentDone is undefined and nothing
    # should be done.
    if currentDone?
      if currentDone
        ++prev.completedCount
      else
        ++prev.activeCount

      if (@filterOn is 'all') or (@filterOn is 'complete' and currentDone) or (@filterOn is 'active' and not currentDone)
        prev.filtered.push @$.model.items[i]

    prev

  ###
  When `@filterOn` changes, update `@filtered` array.

  Platform Feature: Auto-binds change listeners (Polymer)
  -------------------------------------------------------
  
  Polymer elements with properties named like `"#{propertyName}Changed"`,
  are automically bound as a change listener to `propertyName`.
  TODO: Add link.
  ###
  filterOnChanged: ->
    @computedReduction.reduce()

  onClearCompleted: ->
    @$.model.clearCompleted()

  ###
  Creates a new todo, when the enter key is pressed and input
  is not empty.
  ###
  onNewTodoKeypress: ({which})->
    if which is 13 and @$.newTodo.value
      @$.model.addTodo
        text: @$.newTodo.value
        done: false
      @$.newTodo.value = ''

  ###
  Delete todo.
  ###
  onDeleteTodo: (ev, item)->
    @$.model.removeTodo item

Object.defineProperty(v_todos, prop, desc) for prop,desc of do->
  isEditingTodo:
    get: -> true
    set: ->

Polymer 'v-todos', v_todos