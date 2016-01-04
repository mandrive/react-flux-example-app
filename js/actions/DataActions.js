var AppDispatcher = require('../dispatcher/AppDispatcher');
var DataConstants = require('../constants/DataConstants');

var DataActions = {
  loadData: function() {
    AppDispatcher.handleAction({
      actionType: DataConstants.READ
    });
  },
  delete: function(id) {
    AppDispatcher.handleAction({
      actionType: DataConstants.DELETE,
      data: id
    });
  },
  selectForUpdate: function(id) {
    AppDispatcher.handleAction({
      actionType: DataConstants.SELECT_FOR_UPDATE,
      data: id
    });
  }
};

module.exports = DataActions;
