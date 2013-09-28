do->
  nextId = 0

  @MockTodo = MockTodo = (o={})->
    ++nextId
    note = {}
    defs =
      id: "#{nextId}"
      text: "#{nextId} text"
      notes: "#{nextId} notes"
      # For consistency's sake use a different timestamp for each Todo
      lastUpdated: Date.now() - 100000 + nextId
      done: false

    for attr, def of defs
      note[attr] = if o[attr]? then o[attr] else def

    MockTodo.all[note.id] = note

  @MockTodo.all = {}