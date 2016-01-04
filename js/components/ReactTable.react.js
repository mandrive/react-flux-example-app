var React = require('react');
var DataStore = require('../stores/DataStore');
var EventEmitter = require('events').EventEmitter;
var DataActions = require('../actions/DataActions');

var ReactTableRow = React.createClass({
  render: function(){
    return (
      <tr>
        <td>{this.props.row.id}</td>
        <td>{this.props.row.index}</td>
        <td>{this.props.row.guid}</td>
        <td><DeleteIcon rowId={this.props.row.id} /><UpdateIcon rowId={this.props.row.id} /></td>
      </tr>
    );
  }
});

function getData() {
  return {
    rows: DataStore.getData()
  };
}

var ReactApp = React.createClass({
  _onChange: function() {
    var selectedRow = DataStore.getSelected();
    var updateOrNew = selectedRow ? 'update' : 'new';
    this.setState({ selected: DataStore.getSelected(), updateOrNew: updateOrNew });
  },
  getInitialState: function() {
    return {selected: {}, updateOrNew: 'new'}
  },
  componentDidMount: function() {
    DataStore.addChangeListener(this._onChange);
  },
  render: function() {
    return (
      <div>
        <ReactTable />
        <CreateNewBtn />
        <div className="well well-lg">
          <EntryForm updateOrNew={this.state.updateOrNew} entryId={this.state.selected.id}/>
        </div>
      </div>
    )
  }
});

var ReactTable = React.createClass({
  _onChange: function() {
    this.setState(getData());
  },

  getInitialState: function() {
    return {rows: []};
  },

  componentWillMount: function() {
    DataActions.loadData();
  },

  componentDidMount: function() {
    DataStore.addChangeListener(this._onChange);
  },

  render: function(){
    return (
    <table className="table">
      <thead>
        <tr>
        <td>ID</td>
        <td>Index</td>
        <td>GUID</td>
        <td>Action</td>
        </tr>
      </thead>
      <tbody>
        {this.state.rows.map(function(row, i) {
          return <ReactTableRow key={i} row={row} />
        })}
      </tbody>
    </table>
  )
  }
});

var DeleteIcon = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
    DataActions.delete(this.props.rowId);
  },
  render: function() {
    return (
      <a href="#" onClick={this.handleClick}><span className="glyphicon glyphicon-trash"></span></a>
    )
  }
});

var UpdateIcon = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
    DataActions.selectForUpdate(this.props.rowId);
  },
  render: function() {
    return (
      <a href="#" onClick={this.handleClick}><span className="glyphicon glyphicon-pencil"></span></a>
    )
  }
});

var CreateNewBtn = React.createClass({
  handleClick: function() {
    alert('Create new!');
  },
  render: function() {
    return (
      <button className="btn btn-default" onClick={this.handleClick}>Create new entry</button>
    )
  }
});

var EntryForm = React.createClass({
  handleSubmit: function(e) {
    alert('submited');
    e.preventDefault();
  },

  render: function() {
      return (
        <form role="form" onSubmit={this.handleSubmit}>
          <input type="hidden" value={this.props.updateOrNew}/>
          <div className="form-group">
          <label for="entryId">ID</label>
          <input type="text" name="entryId" id="entryId" className="form-control" value={this.props.entryId} /><br/>
          </div>
          <div className="form-group">
          <label for="entryIndex">index</label>
          <input type="text" name="entryIndex" id="entryIndex" className="form-control" value={this.props.entryIndex} /><br/>
          </div>
          <div className="form-group">
          <label for="guid">GUID</label>
          <input type="text" name="guid" id="guid" className="form-control" value={this.props.entryGuid} /><br/>
          </div>
          <button type="submit" className="btn btn-default">SUBMIT</button>
        </form>
      )
  }
});

module.exports = {
  ReactApp: ReactApp,
  ReactTable: ReactTable,
  ReactTableRow: ReactTableRow,
  DeleteIcon: DeleteIcon,
  CreateNewBtn: CreateNewBtn,
  EntryForm: EntryForm
};
