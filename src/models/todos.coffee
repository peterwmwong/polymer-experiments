Polymer 'm-todos',
  ready: ->
    @asyncMethod ->
      @items = this.items or [text:'yolo']
