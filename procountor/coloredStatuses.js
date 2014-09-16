// Generated by CoffeeScript 1.7.1
(function() {
  var colorsStorage, rowsPainter, start, taistApi;
  taistApi = null;
  start = function(_taistApi) {
    taistApi = _taistApi;
    return rowsPainter.watchForRowsToColor();
  };
  rowsPainter = {
    watchForRowsToColor: function() {
      return taistApi.wait.elementRender(((function(_this) {
        return function() {
          return ($('table.v-table-table')).find("tbody tr");
        };
      })(this)), (function(_this) {
        return function(row) {
          return _this._redrawRow(row);
        };
      })(this));
    },
    _redrawRow: function(row) {
      var color;
      color = this._getRowColor(row);
      if (color != null) {
        return this._colorRow(row, color);
      }
    },
    _getRowColor: function(row) {
      var color, docType, status;
      docType = this._getDocType(row);
      status = this._getStatus(row);
      color = colorsStorage.getStatusColor(docType, status);
      return color;
    },
    _getDocType: function(row) {
      return this._getRowCellValue(row, 'Receipt type');
    },
    _getStatus: function(row) {
      var regularStatus;
      regularStatus = this._getRowCellValue(row, 'Status');
      if ((this._isOverdue(row)) && (regularStatus !== "Paid" && regularStatus !== "Invalidated")) {
        return "Overdue";
      } else {
        return regularStatus;
      }
    },
    _isOverdue: function(row) {
      var datePart, dateParts, day, dueDateString, month, overdueStart, year;
      dueDateString = this._getRowCellValue(row, 'Due date');
      dateParts = (function() {
        var _i, _len, _ref, _results;
        _ref = dueDateString.split('.');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          datePart = _ref[_i];
          _results.push(Number.parseInt(datePart));
        }
        return _results;
      })();
      day = dateParts[0], month = dateParts[1], year = dateParts[2];
      overdueStart = new Date(year, month - 1, day + 1);
      return overdueStart < new Date();
    },
    _getRowCellValue: function(row, columnName) {
      var index;
      index = this._getColumnIndex(row, columnName);
      return $(row.find('td')[index]).text();
    },
    _colorRow: function(row, color) {
      return row.attr('style', 'background:' + color + '!important');
    },
    _getColumnIndex: function(row, columnName) {
      var column, columnNames, headersTable, i, _i, _len;
      window.curRow = row;
      headersTable = row.parents('.v-table-body').prev('.v-table-header-wrap');
      columnNames = headersTable.find('td .v-table-caption-container');
      for (i = _i = 0, _len = columnNames.length; _i < _len; i = ++_i) {
        column = columnNames[i];
        if ($(column).text() === columnName) {
          return i;
        }
      }
      return null;
    }
  };
  colorsStorage = {
    getStatusColor: function(docType, status) {
      var _ref, _ref1, _ref2;
      return (_ref = (_ref1 = this._colorsStub[docType]) != null ? _ref1[status] : void 0) != null ? _ref : (_ref2 = this._colorsStub["<All>"]) != null ? _ref2[status] : void 0;
    },
    _colorsStub: {
      "<All>": {
        "Overdue": "#c0392b"
      },
      "Sales invoice": {
        "Not sent": "#f39c12",
        "Approved": "#2ecc71"
      }
    }
  };
  return {
    start: start
  };
});