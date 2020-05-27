import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { Button, Input } from 'reactstrap';

import { Tasks } from '../api/tasks.js';
import { MDBSwitch } from "mdbreact";

// Task component - represents a single todo item
export default class Task extends Component {
    toggleChecked() {
        // Set the checked property to the opposite of its current value
        Meteor.call('tasks.setChecked', this.props.task._id, !this.props.task.checked);
    }

    deleteThisTask() {
        Meteor.call('tasks.remove', this.props.task._id);
    }

    togglePrivate() {
        Meteor.call('tasks.setPrivate', this.props.task._id, ! this.props.task.private);
    }

    showDetail() {
	console.log("details");
 this.setState({
      showDet: !this.state.showDet
,
    });

    }

 constructor(props) {
    super(props);

    this.state = {
      showDet: false,
    };
  }

    render() {
        // Give tasks a different className when they are checked off,
        // so that we can style them nicely in CSS
        const taskClassName = classnames({
        checked: this.props.task.checked,
        private: this.props.task.private,
        });

        return (
        <li className={taskClassName}>
        <Button className="delete" outline color="warning" onClick={this.deleteThisTask.bind(this)}>
        &times;
        </Button>{' '}
        <Input
        type="checkbox"
        readOnly
        checked={!!this.props.task.checked}
        onClick={this.toggleChecked.bind(this)}
        />
        { this.props.showPrivateButton ? ( 
        <Button className="toggle-private" onClick={this.togglePrivate.bind(this)} color="primary" size="sm">
        { this.props.task.private ? 'Private' : 'Public' } 
        </Button>
        ) : ''}

        <span onClick={this.showDetail.bind(this)} style={{ cursor: 'pointer' }}  className="text">
        <strong>{this.props.task.username}</strong> :  {this.props.task.text }  <br /> <strong> Created At : </strong>{this.props.task.createdAt.toLocaleTimeString()} 
        <br /><strong>  Deadline:  </strong>{this.props.task.deadline}
        <br /><strong>  Category:  </strong>{this.props.task.category}
        </span>

		<br/>
		{ this.state.showDet ? 
		(<p><b><br/>ID: </b>{this.props.task._id}<br/>
			<b>Created at:</b> {this.props.task.createdAt.toLocaleTimeString()} <br/>
			<b>Owned by: </b>{this.props.task.username} <br/>
			<b>Text: </b>{this.props.task.text} <br />
            <b>Category: </b>{this.props.task.category} <br />
            <b>Deadline: </b>{this.props.task.deadline}
            </p>)
            : ''}
            </li>
        );
    }
}
