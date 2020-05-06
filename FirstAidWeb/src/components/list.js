import React, { Component } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import Modal from './modal.js';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'

class List extends Component {
  constructor(props) {
    super(props);

    this.replaceModalItem = this.replaceModalItem.bind(this);
    this.state = {
      requiredItem: 0,
      loading: true,
      completed: [],
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
        completed: nextProps.data,
        loading:false
    });
  }   

  replaceModalItem(index) {
    this.setState({
      requiredItem: index
    });
  }

  cellButton(cell, row, enumObject, rowIndex) {
    return (
       <button 
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#exampleModal"
          onClick={() => 
          this.replaceModalItem(cell)}
       >
       Full info
       </button>
    )
 }

  render() {    
    const {loading} = this.state;
    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    
    const requiredItem = this.state.requiredItem;
    //let modalData = this.state.completed[requiredItem];
    let modalData;
    let data = this.state.completed;
    //find correct modalData
    for(let i in data){
      if(data[i].id === requiredItem){
        modalData = data[i]
      }
    }

    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <h1>Completed Tasks</h1>
          <br></br>
        </div>
        {loading ? 
            <div style={style}>
                <ClipLoader/> 
            </div>
        :
            <BootstrapTable
            data={ this.state.completed }
            pagination
            search
            >
                <TableHeaderColumn dataField='id' isKey>Product ID</TableHeaderColumn>
                <TableHeaderColumn width={'30%'} tdStyle={{whiteSpace: 'normal' }} searchable={true} dataField='location'>Location</TableHeaderColumn>
                <TableHeaderColumn width={'30%'} tdStyle={{whiteSpace: 'normal' }} dataField='condition'>Condition</TableHeaderColumn>
                <TableHeaderColumn dataField='timestamp' searchable={true} dataSort={true}>Date</TableHeaderColumn>
                <TableHeaderColumn dataField='id' dataFormat={this.cellButton.bind(this)}>Info</TableHeaderColumn>
            </BootstrapTable>
        }
        <Modal
            data={modalData}
        />
      </div>
    );
  }
}

export default List;