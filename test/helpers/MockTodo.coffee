do->
  nextId = 0

  @MockTodo = MockTodo = (o={})->
    ++nextId
    note = {}
    defs =
      text: "#{nextId} text"
      notes: "#{nextId} notes"
      # For consistency's sake use a different timestamp for each Todo
      done: false
      $:
        id: "#{nextId}"
        lastUpdated: Date.now() - 100000 + nextId

    for attr, def of defs
      note[attr] = if o[attr]? then o[attr] else def

    MockTodo.all[note.$.id] = note

  @MockTodo.all = {}

  @MockEmptyTodo = $:{}

  @MockTodoMap = (todos)->
    map = {}
    for todo in todos
      map[todo.$.id] = todo
    map
