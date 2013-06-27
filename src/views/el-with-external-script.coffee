Polymer 'el-with-external-script',
  ready: ->
    @asyncMethod ->
      @$.msg.textContent = 'From external script...'