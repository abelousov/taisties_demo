->
  taistApi = null
  entryPoint = null
  services = null

  makePanelInactive = (panel) ->
    $ panel
      .removeClass('jt-panel-active')
      .addClass('jt-panel-inactive')

  getCompanyKey = () ->
    location.host

  linkServices = () ->
    services.settings.hipchat.greeting = 'Integration with YouTrack started'
    taistApi.services.link
      source:
        name: 'youtrack'
        settings: services.settings.youtrack
      target:
        name: 'hipchat'
        settings: services.settings.hipchat
      converter: (record) ->
        updates = []
        for key, val of record.change then updates.push "#{key}: #{val.new}"
        record.id + ' ' + updates.join()
    , (a, b) -> console.log a, b

  createContainer = () ->
    hintsPanel = $('.jt-tabpanel-content>div:last')
    hipChatPanel = hintsPanel.clone().empty()
    hipChatPanel.appendTo hintsPanel.parent()

    makePanelInactive hipChatPanel

    hintsTab = $('.jt-tabpanel-navigation .jt-tabpanel-item:last')
    hipChatTab = hintsTab
      .clone()
      .attr('title', 'HipChat')
      .attr('tabid', 'HipChat')
      .removeClass('jt-panel-active')
      .appendTo(hintsTab.parent())
      .click ->
        for elem in $('.jt-panel-active')
          makePanelInactive(elem)
          $(this).addClass 'jt-panel-active'
          hipChatPanel.addClass 'jt-panel-active'

    $('.jt-tabpanel-item').click ->
      if this isnt hipChatTab[0]
        makePanelInactive hipChatPanel
        makePanelInactive hipChatTab

    hipChatTab
      .find('div div')
      .text('HipChat')

    return hipChatPanel

  findProperty = (object, pathString) ->
    path = pathString.split('.')
    result = object
    for i in path
      if result[i] then result = result[i] else return null
    result

  updateProperty = (object, pathString, value) ->
    path = pathString.split('.')
    property = path.pop()
    container = findProperty object, path.join('.')
    container[property] = value

  updateSettings = () ->
    inputs = $('.taistInput')
    for input in inputs
      name = $(input).attr 'name'
      value = $(input).val()
      updateProperty services.settings, name, value
    taistApi.companyData.set 'services.settings', services.settings, ->

  createAddonInterface = () ->
    hipChatPanel = createContainer()

    $('<div>')
      .text('HipChat Integration')
      .addClass('notification__group__title')
      .appendTo(hipChatPanel)

    fields = [
      {
        name: 'youtrack.serverName'
        note: 'Server Name (YouTrack)'
        type: 'text'
      }
      {
        name: 'youtrack.login'
        note: 'User Name (YouTrack)'
        type: 'text'
      }
      {
        name: 'youtrack.password'
        note: 'Password (YouTrack)'
        type: 'password'
      }
      {
        name: 'youtrack.projectId'
        note: 'Project Id (YouTrack)'
        type: 'text'
      }

      {
        name: 'hipchat.authToken'
        note: 'Auth Token (HipChat)'
        type: 'password'
      }
      {
        name: 'hipchat.room'
        note: 'Room Name (HipChat)'
        type: 'text'
      }

    ]

    for elem in fields
      div = $ '<div>'
      switch elem.type
        when 'text', 'password'
          $('<label>')
            .addClass('taistLabel')
            .text(elem.note)
            .appendTo div

          $('<input>')
            .attr('type', elem.type)
            .attr('name', elem.name)
            .addClass('jt-input taistInput')
            .val(findProperty services.settings, elem.name)
            .appendTo div

      div.appendTo hipChatPanel

    $('<button>')
      .text('Create connection with HipChat')
      .addClass('jt-button submit-btn taistButton')
      .appendTo(hipChatPanel)
      .click ->
        updateSettings()
        linkServices()

  onSettingsLoaded = () ->
    createAddonInterface()

  start = (_taistApi, _entryPoint) ->
    taistApi = _taistApi
    entryPoint = _entryPoint

    taistApi.companyData.setCompanyKey getCompanyKey()

    taistApi.companyData.get 'services.settings', (error, settings) ->
      defs =
        youtrack:
          serverName:'taist'
          login:'antonbelousov'
          password:'@00x*psM0$5^'
          projectId:'SH'
        hipchat:
          authToken: 'BGyWsdFa6mnfToP0isAUebV31534pPZ0OKzqI9vi'
          room: 'YouTrack'

      services =
        settings: $.extend {}, defs, settings

      onSettingsLoaded()

  {start}