import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

Date.prototype.formatInput = function(){
    let month = '' + (this.getMonth() + 1);
    let day = '' + this.getDate();
    let year = this.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
};

class SprintGrid extends React.Component {
	constructor(props){    
		super(props);
	
		this.state = {
			intervals: [
				{id: "i1", date: new Date(2020,0,1)},
				{id: "i2", date: new Date(2020,0,2)},
				{id: "i3", date: new Date(2020,0,3)},
				{id: "i4", date: new Date(2020,0,4)}
			],
			tasks: [
				{id: "id1", name: "Задача 1"}, 
				{id: "id2", name: "Задача 2"}, 
				{id: "id3", name: "Задача 3"}, 
				{id: "id4", name: "Задача 4"}
			],
			possibleStatuses: [
				{name: "Не задан", 		color: "antiquewhite"}, 
				{name: "Валидация", 	color: "grey"}, 
				{name: "В работе", 		color: "blue"}, 
				{name: "Тестирование", 	color: "yellow"}, 
				{name: "Выполнено", 	color: "green"}
			],

			statuses: {},
			newTaskName: "",
			newIntervalDate: new Date().formatInput(),
			newStatusColor: "",
			newStatusName: ""
		}

		this.addTask 				= addTask.bind(this);		
		this.addInterval 			= addInterval.bind(this);
		this.getUpdatedStatusesObj 	= getUpdatedStatusesObj.bind(this);
		this.handleInputChange 		= this.handleInputChange.bind(this);
		this.handleSelectionChange 	= this.handleSelectionChange.bind(this);
		this.deleteInterval			= deleteInterval.bind(this);
		this.deleteTask				= deleteTask.bind(this);
		this.addStatus				= addStatus.bind(this);
		this.intervalChangeHandler  = intervalChangeHandler.bind(this);
		this.taskChangeHandler  	= taskChangeHandler.bind(this);

		this.state.statuses = this.getUpdatedStatusesObj();

	}

	handleSelectionChange(event, taskId, intervalId) {
		let statuses = this.state.statuses;
		
		statuses[taskId][intervalId] = event.target.selectedIndex;
	
		this.setState({statuses});
	}

	handleInputChange(event) {
		const value = event.target.value;
		const name = event.target.name;

		if (event.target.type === "date") {
			if (value !== new Date(value).formatInput())
				return;
		}

		this.setState({
		  	[name]: value
		});
	}

	render() {
		return (
			<div className="container_main">
				<div className="menu">
					<div>
						<form>
							<input className="menu_input" placeholder="Важная задача!" type="text" value={this.state.newTaskName} name="newTaskName" onChange={this.handleInputChange} ></input>
							<button className="menu_btn" onClick={(event) => {
								event.preventDefault();
								this.addTask();
							}} 
							>Добавить задачу</button>
						</form>

						<form>
							<input className="menu_input" type="date" value={this.state.newIntervalDate} name="newIntervalDate" onChange={this.handleInputChange} ></input>
							<button className="menu_btn" onClick={(event) => {
								event.preventDefault();
								this.addInterval();
							}} 
							>Добавить интервал</button>
						</form>
					</div>
					<div>
						<form className="menu-form-right">
							<div className="btn-wrapper">
								<input className="menu_input" placeholder="Название" type="text" value={this.state.newStatusName} name="newStatusName" onChange={this.handleInputChange} ></input>
								<input className="menu_input" placeholder="html цвет" type="text" value={this.state.newStatusColor} name="newStatusColor" onChange={this.handleInputChange} ></input>
							</div>
							<button className="menu_btn" onClick={(event) => {
								event.preventDefault();
								this.addStatus();
							}} 
							>Добавить статус</button>
						</form>
					</div>

				</div>
				<div className="table-wrapper">
					<div className="table-row table-header-row">
						<div className="table-cell table-header-cell table-left-cell">Задачи</div>

						{this.state.intervals.map(interval => {
							return (
								<div className="table-cell table-header-cell" key={interval.id}>
									<input type="date" 
										   value={interval.date.formatInput()} 
										   onChange={(event)=>{this.intervalChangeHandler(event, interval.id)}}
										   className="transparent"></input>
									<div onClick={()=>{this.deleteInterval(interval.id)}} className="delete-btn">{"\u274C"}</div>
								</div>
							)
						})}
					</div>

					{this.state.tasks.map(task => {
						return (
						<div className="table-row" key={task.id}> 
						
							<div className="table-cell table-left-cell">
								<input className="transparent" value={task.name} onChange={(event)=>{this.taskChangeHandler(event, task.id)}}></input>
								<div onClick={()=>{this.deleteTask(task.id)}} className="delete-btn">{"\u274C"}</div>
							</div>

							{this.state.intervals.map(interval => {
								let color = (this.state.statuses[task.id] && 
											this.state.statuses[task.id][interval.id] && 
											this.state.possibleStatuses[this.state.statuses[task.id][interval.id]].color) || this.state.possibleStatuses[0].color;

								return (
									<div className={`table-cell table-header-cell`} style={{backgroundColor: color}}>
										<select className={"status-selection"} onChange={(event) => this.handleSelectionChange(event, task.id, interval.id)}>
											{this.state.possibleStatuses.map((status, i) => {
												return (
													<option value={i}>
														{status.name}
													</option>
												)
											})}
										</select>
									</div>
								)
							})}
						</div>)
					})}

				</div>
				
			</div>
		)
	}
} 

function intervalChangeHandler(event, intervalId) {
	let intervals = this.state.intervals.slice();
	let intervalIndex = -1;

	for (let i = 0; i < intervals.length; i++) {
		if (intervals[i].id === intervalId) {
			intervalIndex = i;
			break;
		}
	}

	if (intervalIndex === -1)
		return;

	intervals[intervalIndex].date = new Date(event.target.value);

	intervals.sort((a, b) => {
		return new Date(a.date) - new Date(b.date)
	})

	this.setState({intervals}, ()=> {this.setState({statuses: this.getUpdatedStatusesObj()})});
}

function taskChangeHandler(event, taskId) {
	let tasks = this.state.tasks.slice();
	let taskIndex = -1;

	for (let i = 0; i < tasks.length; i++) {
		if (tasks[i].id === taskId) {
			taskIndex = i;
			break;
		}
	}

	if (taskIndex === -1)
		return;

	tasks[taskIndex].name = event.target.value;

	this.setState({tasks}, ()=> {this.setState({statuses: this.getUpdatedStatusesObj()})});
}

function addStatus(){
	let possibleStatuses = this.state.possibleStatuses.slice();

	possibleStatuses.push({name: this.state.newStatusName, color: this.state.newStatusColor});

	this.setState({possibleStatuses, newStatusName: "", newStatusColor: ''});
}

function addTask(){
	let tasks = this.state.tasks.slice();

	tasks.push({id: generateId(), name: this.state.newTaskName});

	this.setState({tasks, newTaskName: ""}, ()=> {this.setState({statuses: this.getUpdatedStatusesObj()})});
}

function addInterval(){
	let intervals = this.state.intervals.slice();

	intervals.push({id: generateId(), date: new Date(this.state.newIntervalDate)});

	intervals.sort((a, b) => {
		return new Date(a.date) - new Date(b.date)
	})

	this.setState({intervals}, ()=> {this.setState({statuses: this.getUpdatedStatusesObj()})});
}

function deleteTask(taskId){
	let tasks = this.state.tasks.slice();
	let taskIndex = -1;

	for (let i = 0; i < tasks.length; i++) {
		if (tasks[i].id === taskId) {
			taskIndex = i;
			break;
		}
	}

	if (taskIndex === -1)
		return;

	tasks.splice(taskIndex, 1);

	this.setState({tasks}, ()=> {this.setState({statuses: this.getUpdatedStatusesObj()})});

}

function deleteInterval(intervalId){
	let intervals = this.state.intervals.slice();
	let intervalIndex = -1;

	for (let i = 0; i < intervals.length; i++) {
		if (intervals[i].id === intervalId) {
			intervalIndex = i;
			break;
		}
	}

	if (intervalIndex === -1)
		return;

	intervals.splice(intervalIndex, 1);

	this.setState({intervals}, ()=> {this.setState({statuses: this.getUpdatedStatusesObj()})});

} 

function generateId () {
    return "id" + Math.random().toString(16).slice(2);
}

function getUpdatedStatusesObj() {
	let statuses = {};

	this.state.tasks.forEach(task => {
		statuses[task.id] = {};

		this.state.intervals.forEach(interval => {
			statuses[task.id][interval.id] = (this.state.statuses[task.id] && this.state.statuses[task.id][interval.id]) || 0;
		})
	})
	
	return statuses;
}
ReactDOM.render(
    <SprintGrid />,
  document.getElementById('root')
);


serviceWorker.unregister();
