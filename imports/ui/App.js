import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import ReactNotifications from 'react-notifications-component';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';
import ReactInterval from 'react-interval';
import { Tasks } from '../api/tasks.js';

import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';

import {
    Input,
    Form,
    Button,
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    Progress,
    Alert,
 } from 'reactstrap';


// App component - represents the whole app
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
  hideCompleted: false,
  quickAdd: true,
  myfunc:'all',
  grocerycount:'',
  workcount:'',
  homecount:''
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
const deadline= ReactDOM.findDOMNode(this.refs.textDeadline).value.trim();
const category=ReactDOM.findDOMNode(this.refs.category).value.trim();

    Tasks.insert({
      text,
     deadline,
     category,
      createdAt: new Date(), // current time

    });
    Meteor.call('tasks.insert', text,deadline,category);

    store.addNotification({
      title: 'Added Task:',
      message: text,
      type: 'default',                         
      container: 'top-right',                
      showIcon: true,
      width: 200,
      animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
      animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
      dismiss: {
        duration: 2000 
      } 
    });

    
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
    ReactDOM.findDOMNode(this.refs.textDeadline).value = '';
   
    var dt=new Date();
    var dt1=new Date(deadline);
    var difference=dt1.getTime()-dt.getTime();
 
    this.timer = setTimeout(() => this.notifier(text),6000);
    
  }

  notifier(text){
    store.addNotification({
      title: 'Your task reminder:',
      message: text,
      type: 'default',                         // 'default', 'success', 'info', 'warning'
      container: 'top-left',                // where to position the notifications
      width: 200,
      animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
      animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
      dismiss: {
        duration: 2000
      } 
    }); 
  }
  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }
  handleCategoryWork(){
    this.setState({
      myfunc:'work'
    })
  }
  handleCategoryHome(){
    this.setState({
      myfunc:'home'
    })
  }
  handleCategoryGrocery(){
    this.setState({
      myfunc:'grocery'
    })
  }
  handleCategoryAll(){
    this.setState({
      myfunc:'all'
    })
  }
 quickAddCompleted() {
    this.setState({
      quickAdd: !this.state.quickAdd,
    });
  }
handleScreenSharing(){
  console.log("screen sharing");
  window.location.href="screen.html"
}

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
    const currentUserId = this.props.currentUser && this.props.currentUser._id;
    const showPrivateButton = task.owner === currentUserId;
    return (
    <Task
    key={task._id}
    task={task}
    showPrivateButton={showPrivateButton}        
          />
       
      );
    });
  }
  renderWorkTasks() {
    let filteredTasks = this.props.tasks; 
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    filteredTasks = filteredTasks.filter(task => task.category=='work');
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
     
      const showPrivateButton = task.owner === currentUserId;

      return (
          <Task
              key={task._id}
              task={task}
              showPrivateButton={showPrivateButton}
            
          />
      );
    });
  }
  
  renderGroceryTasks() {
    let filteredTasks = this.props.tasks; 
       if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
      filteredTasks = filteredTasks.filter(task => task.category=='grocery');
      
    let gcount=filteredTasks.filter(task=>task.checked).length;   
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
          <Task
              key={task._id}
              task={task}
              showPrivateButton={showPrivateButton}
            
          />
      );
    });
  }
  renderHomeTasks() {
    let filteredTasks = this.props.tasks; 
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    filteredTasks = filteredTasks.filter(task => task.category=='home');
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return (
          <Task
              key={task._id}
              task={task}
              showPrivateButton={showPrivateButton}          
          />
      );
    });
  }
  render() {
    
    let completedRatio = 1-this.props.incompleteCount/this.props.totalCount;
    let completedPercentage = (completedRatio*100).toFixed(2);
    let completed=this.props.totalCount - this.props.incompleteCount;
    return (
        <>
          {/*<DemoNavbar />*/}
          <div>
          <ReactNotifications />
            <Navbar color="light" light expand="md" className='dark-nav'>
            <NavbarBrand href="/" className='text-center'>Todofy</NavbarBrand>
            <Nav>
            <NavItem className='text-center'>
            <AccountsUIWrapper />
            </NavItem>
            </Nav>
            </Navbar>
          </div>
          <br />
          <div className='main-section-container container'>
            {this.props.currentUser ?
                <div className="container-fluid shadow-box">
                  <header>
                    <h2 className='text-center'>Todo List ({completed}/{this.props.totalCount})</h2>
                  </header>
                  <div>
                    <div className="text-center">{completedPercentage}%</div>
                    <Progress animated value={completedPercentage} color="info" />
                   <br />
                    <div className="circular-progress container">
                    <CircularProgressbar
                    value={completedPercentage}
                    text={`${completedPercentage}%`}
                    strokeWidth={10}
                    styles={buildStyles({
                    textColor: "black",
                    pathColor: "#633f6e",
                    trailColor: "#b3aeb4",
                    textSize: "14px"         

        })}
      />  </div>
       <Form>
        <Input type="text" ref="textInput" 
          placeholder="Add new task"
          className="inputs"
        />
        <Input type="date"
        ref="textDeadline"
        placeholder="Add deadline"
        className="inputs"
        />
          <Input  className="inputs" type="select" ref="category">
          <option>select category</option>
          <option>work</option>
          <option>home</option>
          <option>grocery</option>
          <option>others</option>
        </Input>
        <br />
    <Button onClick={this.handleSubmit.bind(this)} 
    color="primary" size="sm">Add Task</Button>
        </Form>
              
      <br />

      <div className="container"> 
      <div className="circular-progress1"> 
      <h5 className="mycenter">Home</h5>
      <img className="image1" onClick={this.handleCategoryHome.bind(this)} src='data:image/jpeg;base64,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' alt="Smiley face" /> 
     </div>
     
     <div className="circular-progress2">
      <h5 className="mycenter">Work</h5>
      <img className="image2" onClick={this.handleCategoryWork.bind(this)} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVgH7aVDFnnfrhgaKqwx37aevw2f5lvc9UavM0gVE-yet2T7VQ5Q&s' alt="Smiley face" /> 
     </div></div>
<br />
     <div className="circular-progress1">
     <h5 className="mycenter">Grocery</h5>
      <img className="image3"  onClick={this.handleCategoryGrocery.bind(this)} src='https://classroomclipart.com/images/gallery/Clipart/Food/Grocery_Clipart/shopping-cart-full-of-grocery-clipart-5122.jpg' alt="Smiley face" /> 
     </div>
     <div className="circular-progress2">
     <h5 className="mycenter">All</h5>
      <img className="image4" onClick={this.handleCategoryAll.bind(this)} src='http://www.presentationpro.com/images/product/medium/slide/PPP_CGENE_LT3_Notepad_w_Pencil.jpg' alt="Smiley face" /> 
     </div>
    </div>
                  
  <br />
    {
      completedRatio==1?
      <div>
                              
      <Alert color="success">
      <h4 className="alert-heading">Well done!</h4>
      <p>
      You've completed all the tasks.
      </p>
      <hr />
      <p className="mb-0">
      You deserve a cupcake. Go have one.
      </p>
     </Alert>
    </div>
      :
    ""
    }		
    <br/>
    <div>
    <p>
		<div className='custom-control custom-switch'>
    <Input type="checkbox" readOnly className='custom-control-input'
    id='customSwitchesChecked2' checked={this.state.hideCompleted}
    onClick={this.toggleHideCompleted.bind(this)} />
    <label className='custom-control-label' htmlFor='customSwitchesChecked2'>
    </label>
    Show Pending Tasks                      
			</div>
      </p>
        <div>{(() => {
        if (this.state.myfunc =='work') {
          return (
            <div className='shadow-box-neat'>
            <ul id='todo-list-work'>
              {this.renderWorkTasks()}
            </ul>
          </div>
          )
        } else if (this.state.myfunc =='home') {
          return (
            <div className='shadow-box-neat'>
            <ul id='todo-list-home'>                    
            {this.renderHomeTasks()}
            </ul>
           </div>
          )
        }
        else if (this.state.myfunc =='grocery') {
          return (
            <div className='shadow-box-neat'>
            <ul id='todo-list-grocery'>
            {this.renderGroceryTasks()}
            </ul>
            </div>
          )
        } else {
          return (
            <div className='shadow-box-neat'>
            <ul id='todo-list'> 
            {this.renderTasks()}
            </ul>
            </div>
          )
        }
      })()}
    </div>
    </div>
  </div>
      :
      <div className="container-fluid" id="main-section-container">
      <div className="container-fluid header" id="login-header">
      <div className="row" id="header">
      <div className="col">
      <h1>Todofy</h1>
      <h2><i>Realtime </i>Todo Manager<br/>
      <i>Perfect</i> for personal use and collaborative work.
      </h2>
      </div>
      </div>
      <div className="container px-lg-5">
      <div className="row mx-lg-n5" id="awesome-features">
      <div className="col py-4 px-lg-1" id="awesome-features-box">
      <h2><b>Features</b></h2>
      </div>
      <div className="col py-4 px-lg-5 awesome-features-details">
      <h3><i>Elegant, Fast, Secure.</i></h3>
      <br />
      <br />
      <br />
      <h4>✓ Secure</h4>
      <p>Sensitive information, like password, is encrypted before storage.</p>
      <br />
      <h4>✓ Realtime</h4>
      <p>All the changes made by any member are reflected in realtime.</p>
      </div>
      <div className="col py-4 px-lg-5 awesome-features-details" id="awesome-features-details">
      <h4>✓ Free </h4>
      <p>It's free to use, now and forever!</p>
      <br />
      <h4>✓ Clean and Responsive Design </h4>
      <p>Simple yet elegant design is employed throughout the app. It handles different screen sizes without weird changes in look and feel.</p>
      <br />
      <h4>✓ Multi-platform Support </h4>
      <p>Runs perfectly on web, android and IOS.</p>
      </div>
      </div>
      </div>
      <br />
      </div>
      <br />
      </div>
      }
    </div>
    </>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('tasks');

  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    totalCount: Tasks.find({}).count(),
    currentUser: Meteor.user(),
  };
})(App);
