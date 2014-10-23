// Generated by CoffeeScript 1.8.0
(function() {
  var createAddonInterface, createContainer, entryPoint, findProperty, getCompanyKey, linkServices, makePanelInactive, onSettingsLoaded, services, start, taistApi, updateProperty, updateSettings;
  taistApi = null;
  entryPoint = null;
  services = null;
  makePanelInactive = function(panel) {
    return $(panel).removeClass('jt-panel-active').addClass('jt-panel-inactive');
  };
  getCompanyKey = function() {
    return location.host;
  };
  linkServices = function() {
    services.settings.hipchat.greeting = 'Integration with YouTrack started';
    return taistApi.services.link({
      source: {
        name: 'youtrack',
        settings: services.settings.youtrack
      },
      target: {
        name: 'hipchat',
        settings: services.settings.hipchat
      },
      converter: function(record) {
        var beautify, color, key, updates, val, wrapId, _ref;
        wrapId = function(id) {
          return "<a href=\"http://taist.myjetbrains.com/youtrack/issue/" + id + "\">" + id + "</a>";
        };
        beautify = function(key, val) {
          var message;
          switch (key.toLowerCase()) {
            case 'description':
              return message = "<b>Description</b><br><i>" + (val.replace(/\n/g, '<br>')) + "</i>";
            case 'state':
              return message = "<b>State</b> " + val;
            default:
              return message = "" + key + ": " + val;
          }
        };
        updates = ["" + (wrapId(record.id)) + " updated by " + record.author];
        color = "green";
        _ref = record.change;
        for (key in _ref) {
          val = _ref[key];
          updates.push(beautify(key, val["new"]));
          if (key.toLowerCase() === 'state') {
            color = 'red';
          }
        }
        return {
          message: updates.join('<br>'),
          color: color
        };
      }
    }, function(a, b) {
      return console.log(a, b);
    });
  };
  createContainer = function() {
    var hintsPanel, hintsTab, hipChatPanel, hipChatTab;
    hintsPanel = $('.jt-tabpanel-content>div:last');
    hipChatPanel = hintsPanel.clone().empty();
    hipChatPanel.appendTo(hintsPanel.parent());
    makePanelInactive(hipChatPanel);
    hintsTab = $('.jt-tabpanel-navigation .jt-tabpanel-item:last');
    hipChatTab = hintsTab.clone().attr('title', 'HipChat').attr('tabid', 'HipChat').removeClass('jt-panel-active').appendTo(hintsTab.parent()).click(function() {
      var elem, _i, _len, _ref, _results;
      _ref = $('.jt-panel-active');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        makePanelInactive(elem);
        $(this).addClass('jt-panel-active');
        _results.push(hipChatPanel.addClass('jt-panel-active'));
      }
      return _results;
    });
    $('.jt-tabpanel-item').click(function() {
      if (this !== hipChatTab[0]) {
        makePanelInactive(hipChatPanel);
        return makePanelInactive(hipChatTab);
      }
    });
    hipChatTab.find('div div').text('HipChat');
    return hipChatPanel;
  };
  findProperty = function(object, pathString) {
    var i, path, result, _i, _len;
    path = pathString.split('.');
    result = object;
    for (_i = 0, _len = path.length; _i < _len; _i++) {
      i = path[_i];
      if (result[i]) {
        result = result[i];
      } else {
        return null;
      }
    }
    return result;
  };
  updateProperty = function(object, pathString, value) {
    var container, path, property;
    path = pathString.split('.');
    property = path.pop();
    container = findProperty(object, path.join('.'));
    return container[property] = value;
  };
  updateSettings = function() {
    var input, inputs, name, value, _i, _len;
    inputs = $('.taistInput');
    for (_i = 0, _len = inputs.length; _i < _len; _i++) {
      input = inputs[_i];
      name = $(input).attr('name');
      value = $(input).val();
      updateProperty(services.settings, name, value);
    }
    return taistApi.companyData.set('services.settings', services.settings, function() {});
  };
  createAddonInterface = function() {
    var div, elem, fields, hipChatPanel, _i, _len;
    hipChatPanel = createContainer();
    $('<div>').text('HipChat Integration').addClass('notification__group__title').appendTo(hipChatPanel);
    fields = [
      {
        name: 'youtrack.serverName',
        note: 'Server Name (YouTrack)',
        type: 'text'
      }, {
        name: 'youtrack.login',
        note: 'User Name (YouTrack)',
        type: 'text'
      }, {
        name: 'youtrack.password',
        note: 'Password (YouTrack)',
        type: 'password'
      }, {
        name: 'youtrack.projectId',
        note: 'Project Id (YouTrack)',
        type: 'text'
      }, {
        name: 'hipchat.authToken',
        note: 'Auth Token (HipChat)',
        type: 'password'
      }, {
        name: 'hipchat.room',
        note: 'Room Name (HipChat)',
        type: 'text'
      }
    ];
    for (_i = 0, _len = fields.length; _i < _len; _i++) {
      elem = fields[_i];
      div = $('<div>');
      switch (elem.type) {
        case 'text':
        case 'password':
          $('<label>').addClass('taistLabel').text(elem.note).appendTo(div);
          $('<input>').attr('type', elem.type).attr('name', elem.name).addClass('jt-input taistInput').val(findProperty(services.settings, elem.name)).appendTo(div);
      }
      div.appendTo(hipChatPanel);
    }
    return $('<button>').text('Create connection with HipChat').addClass('jt-button submit-btn taistButton').appendTo(hipChatPanel).click(function() {
      updateSettings();
      return linkServices();
    });
  };
  onSettingsLoaded = function() {
    return createAddonInterface();
  };
  start = function(_taistApi, _entryPoint) {
    taistApi = _taistApi;
    entryPoint = _entryPoint;
    taistApi.companyData.setCompanyKey(getCompanyKey());
    return taistApi.companyData.get('services.settings', function(error, settings) {
      var defs;
      defs = {
        youtrack: {
          serverName: 'taist',
          login: 'antonbelousov',
          password: '@00x*psM0$5^',
          projectId: 'SH'
        },
        hipchat: {
          authToken: 'BGyWsdFa6mnfToP0isAUebV31534pPZ0OKzqI9vi',
          room: 'YouTrack'
        }
      };
      services = {
        settings: $.extend({}, defs, settings)
      };
      return onSettingsLoaded();
    });
  };
  return {
    start: start
  };
});
