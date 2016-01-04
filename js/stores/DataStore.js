var DataConstants = require('../constants/DataConstants');
var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('../dispatcher/AppDispatcher');
var _ = require('underscore');

var _data = [];
var _selected = {};

var DataStore = _.extend({}, EventEmitter.prototype, {
  create: function() {
    console.log('data created');
  },

  getData: function() {
    return _data;
  },

  read: function() {
    var self = this;

    $.getJSON('./testData/data.json', {}, function(data) {
      _data = data;
      self.emitChange();
    });

    console.log('data loaded');
  },

  update: function() {
    console.log('data updated');
  },

  delete: function(rowId) {
    var index = -1;
    for(var i=0; i<_data.length; i++)
    {
      if (_data[i].id === rowId)
      {
        index = i;
      }
    }

    if (index > -1)
    {
      _data.splice(index, 1);
      this.emit('change');
    }
  },
  selectForUpdate: function(id) {
    for(var i=0; i<_data.length; i++)
    {
      if (_data[i].id === id)
      {
        _selected = _data[i];
        break;
      }
    }

    this.emit('change');
  },
  getSelected: function() {
    return _selected;
  },
  // Emit Change event
  emitChange: function() {
    this.emit('change');
  },

  // Add change listener
  addChangeListener: function(callback) {
    this.on('change', callback);
  },

  // Remove change listener
  removeChangeListener: function(callback) {
    this.removeListener('change', callback);
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action.actionType) {

    // Respond to READ action
    case DataConstants.READ:
      DataStore.read();
      break;

    case DataConstants.DELETE:
      DataStore.delete(action.data);
      break;

    case DataConstants.CREATE:
      DataStore.create(action.data);
      break;

    case DataConstants.UPDATE:
      DataStore.update(action.data);
      break;

    case DataConstants.SELECT_FOR_UPDATE:
      DataStore.selectForUpdate(action.data);
      break;

    default:
      return true;
  }

  // If action was responded to, emit change event
  DataStore.emitChange();

  return true;

});

module.exports = DataStore;
