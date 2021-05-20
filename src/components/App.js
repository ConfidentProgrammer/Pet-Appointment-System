import '../css/App.css';
import AddAppointments from './AddAppointments';
import ListAppointments from './ListAppointments';
import SearchAppointments from './SearchAppointments';
import React, {Component} from 'react';
import { findIndex, without } from 'lodash';


class App extends Component {  //this is the class based components, 

constructor(){ //constructor is required to use state and setState of the classbased components. it is like the useState in the funcrional component
  super();

  this.state = {  //first of all appointment is empty because we need to fetch the data in it.
    myAppoinment:[],
    formDisplay:false,
    lastIndex:0,
    orderBy:'ownerName',
    queryText : '',
    orderDir:'asc'
  }

  this.deleteAppointment = this.deleteAppointment.bind(this);  //this is for the changing the behavoiur of the this word
  this.toggleForm = this.toggleForm.bind(this);
  this.AddAppointment = this.AddAppointment.bind(this);
  this.changeOrder = this.changeOrder.bind(this);
  this.searchApts = this.searchApts.bind(this);
  this.updateInfo = this.updateInfo.bind(this);

}

toggleForm(){
  this.setState({
    formDisplay:!this.state.formDisplay
  });
}

changeOrder(order, dir){
 this.setState({
   orderBy:order,
   orderDir: dir
 });
}
AddAppointment(apt){
  let tempApt = this.state.myAppoinment;
 apt.aptId = this.lastIndex;
 tempApt.unshift(apt);
 this.setState({
   myAppoinment:tempApt,
   lastIndex : this.state.lastIndex+1
 })
}


updateInfo(name, value, id){
  let tempApts = this.state.myAppoinment;
  let aptIndex = findIndex(this.state.myAppoinment, {
    aptId : id
  });

  tempApts[aptIndex][name]  = value ; 
  this.setState({
    myAppoinment : tempApts
  })
}

searchApts(query){
  this.setState({queryText: query})
}

deleteAppointment(apt){
let tempApts = this.state.myAppoinment;
tempApts = without(tempApts, apt);    //use to filter the array...

this.setState({
  myAppoinment:tempApts
});
}
componentDidMount(){ //this is the lifecycle method that fetch the data when components is rendered by the DOM

  fetch('./data.json') //this is the using of the fetch api fetching the data in the json format
  .then(response => response.json()) // promise
  .then(result => {
    const apts = result.map(item => { //this is the using of the map function that iterates through the data.
      item.aptId = this.state.lastIndex;
      this.setState({lastIndex: this.state.lastIndex+1})
      return item; 
    })


    this.setState({
      myAppoinment :apts //using of the setState function that stores the myAppointment to the apts.
    })
  });

  
}

  render(){ // this is the render function which renders the UI to the screen... 

   let order;
   let filteredApts = this.state.myAppoinment;
   if(this.state.orderDir === 'asc'){
     order = 1;
   }else{
     order = -1;
   }

   filteredApts = filteredApts.sort((a,b) => {
     if(a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()){
       return -1*order;
     }else{
       return 1*order;
     }
   }).filter(eachItem => {
     return (
       eachItem['petName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
       eachItem['ownerName'].toLowerCase().includes(this.state.queryText.toLowerCase()) ||
       eachItem['aptNotes'].toLowerCase().includes(this.state.queryText.toLowerCase()) 
     )
   });

  return (
    <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
              <AddAppointments AddAppointment={this.AddAppointment} toggleForm={this.toggleForm} formDisplay={this.state.formDisplay} /> 
              <SearchAppointments searchApts={this.searchApts} changeOrder={this.changeOrder} orderBy = {this.state.orderBy} orderDir={this.state.orderDir}/>
              <ListAppointments  updateInfo={this.updateInfo} appointments={filteredApts}
              deleteAppointment={this.deleteAppointment}
              />
                     
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
}
export default App;
