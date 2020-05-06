import React, { Component } from 'react';
import moment from 'moment';

class Modal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modaldata: {},
            locc: this.props.data
        }
    }

    componentWillReceiveProps(nextProps) {

        if(this.props.loc !== nextProps.data){
            this.setState({
               modaldata: nextProps.data,
            })
         }
    }


    render() {
        var now = moment.unix(this.state.modaldata.timestampstart/1000).format("DD/MM/YYYY, HH:mm:ss");
        var then = moment.unix(this.state.modaldata.completedtime/1000).format("DD/MM/YYYY, HH:mm:ss");
        const created = moment.unix(this.state.modaldata.timestampstart/1000).format("MMMM Do YYYY, HH:mm:ss");
        const diff = moment.duration(moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(now,"DD/MM/YYYY HH:mm:ss"))).humanize();

        return (
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Full information of a task</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{fontWeight: 'bold'}}>
                                Date: <p style={{fontWeight: 'normal'}}>{created}</p>
                            </div>
                            <div style={{fontWeight: 'bold'}}>
                                Location: <p style={{fontWeight: 'normal'}}>{this.state.modaldata.location}</p>
                            </div>
                            <div style={{fontWeight: 'bold'}}>
                                Location Details: <p style={{fontWeight: 'normal'}}>{this.state.modaldata.locationDescription}</p>
                            </div>
                            <div style={{fontWeight: 'bold'}}>
                                Condition: <p style={{fontWeight: 'normal'}}>{this.state.modaldata.condition}</p>
                            </div>
                            <div style={{fontWeight: 'bold'}}>
                                Victim Details: <p style={{fontWeight: 'normal'}}>Gender: {this.state.modaldata.gender} Age: {this.state.modaldata.age}</p>
                            </div>
                            <div style={{fontWeight: 'bold'}}>
                                Caller Name/Victim Name: <p style={{fontWeight: 'normal'}}>{this.state.modaldata.name}, {this.state.modaldata.victimName}</p>
                            </div>
                            <div style={{fontWeight: 'bold'}}>
                                Caller phone nr: <p style={{fontWeight: 'normal'}}>{this.state.modaldata.phone}</p>
                            </div>
                            <div style={{fontWeight: 'bold'}}>
                                Aider Details: <p style={{fontWeight: 'normal'}}>{this.state.modaldata.aiderName}, {this.state.modaldata.aiderEmail}</p>
                            </div>
                            <div style={{fontWeight: 'bold'}}>
                                Time taken to complete the task: <p style={{fontWeight: 'normal'}}>{diff}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;