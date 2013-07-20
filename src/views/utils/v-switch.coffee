Polymer 'v-switch',
  switchChanged: ->
    for node in @$.items.getDistributedNodes()
      addRemove =
        if @switch is node.getAttribute 'case' then 'add'
        else 'remove'
      node.classList[addRemove] 'enabled'

    @switch
