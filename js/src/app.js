var ReactDOM = require('react-dom');
var React = require('react');
var Dispatcher = require('Flux').Dispatcher;
var DataStore = require('../stores/DataStore');
var ReactApp = require('../components/ReactTable.react').ReactApp;

ReactDOM.render(
        <ReactApp />,
        document.getElementById('content')
);

$(function() {
  $("#loadDataBtn").click(function() {
    DataStore.read();
  });
});
