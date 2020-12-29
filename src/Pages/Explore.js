// Explore Page

import React, { Component  } from "react";
import { ProgressBar} from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead';
import "../App.css";
import "../styles/explore.css";
import NavbarComp from "../components/navbar";
import Axios from "axios";
import FlightsComp from "../components/flights";
import HotelsComp from "../components/hotels";
import CarsComp from "../components/cars";

import options from '../components/data';
import 'react-bootstrap-typeahead/css/Typeahead.css';

class Explore extends Component {


  state = {
    hotels: [],
    flights: [],
    source: '',
    destination: '',
    datefrom: new Date(1999,0,1),
    dateto: new Date(1999,0,1),
    days: 0,
    flightPrice: 0,
    flightcarriercode: '',
    flightnumber: 0,
    flightarrival: '',
    flightdeparture: '',
    hotelPrice: 0,
    hotelimageurl: '',
    hotellocation: '',
    hotelname: '',
    carPrice: 0,
    cartype: '',
    carimageurl: '',
    progress: 0,
    hotelSelectID: '',
    userstatus: '',
  };

  componentDidMount = async(e) =>{

    Axios({
      method: "POST",
      withCredentials: true,
      url: "http://localhost:5000/hotelsearch",
      data:{
        searchloc: this.state.destination,
        datefrom: this.state.datefrom,
        dateto: this.state.dateto
      }
    }).then((res) => {
      this.setState({ hotels: res.data });
      console.log(res.data);
    });

    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/userstatus",

    }).then((res) => {
      this.setState({ userstatus: res.data });
    });
    
  }

  handleSourceChange = async(e) =>{
    if(e[0]){
      console.log(e[0].capital);
      this.setState({source: e[0].capital});
    }
    
    //await this.setState({source: e.target.value});
  }
  handleDestinationChange = async(e) =>{
    if(e[0]){
      console.log(e[0].capital);
      this.setState({destination: e[0].capital});
    }
    //await this.setState({destination: e.target.value});
  }

  handleDateFromChange = async(e) =>{
    await this.setState({datefrom: e.target.value});
  }

  handleDateToChange = async(e) =>{
    await this.setState({dateto: e.target.value});
    var d1 = new Date(this.state.dateto);
    var d2 = new Date(this.state.datefrom);
    var diff_time = d1.getTime() - d2.getTime();
    var diff_days = diff_time/ (1000 * 3600 * 24);
    this.setState({days: diff_days});
  }

  handleSearchClick = (e) =>{
    e.preventDefault();
    var d = new Date('2000-01-01');
    var d1 = new Date(this.state.dateto);
    var d2 = new Date(this.state.datefrom);
    if (this.state.source==='' || this.state.destination===''|| d1 < d || d2 < d){
        alert("Please fill all fields to proceed!")
    }
    else if (d1<d2){
        alert("You can't travel back in time, sweetie")
    }
    else{
      


            if(!this.state.userstatus) alert("Heads up: Unlesss you're logged in, you won't be able to book!")
            
              this.setState({ progress: 1 });
                Axios({
                    method: "POST",
                    withCredentials: true,
                    url: "http://localhost:5000/date",
                    data:{
                      arrival: this.state.dateto,
                      locationDeparture: this.state.source,
                      locationArrival: this.state.destination,
                    }
                  }).then((res) => {
                    this.setState({ flights: res.data.data });
                    
                    //console.log(res.data.data);
                  });

        
 
        
    }
   
  }

  handleSortChange = async(e) =>{
    //console.log(e.target.value);

    let list = this.state.hotels;
    if (e.target.value === 'p-asc'){
      list.sort(function (a, b) {
        return a.price - b.price;
      });
    }
    if (e.target.value === 'p-desc'){
      list.sort(function (a, b) {
        return b.price - a.price;
      });
    }
    await this.setState({ hotels: list });

  }

  selectFlight = (price, departure, arrival, carriercode, number ) =>{
    this.setState({
      flightPrice:price,
      flightarrival: arrival,
      flightdeparture: departure,
      flightcarriercode: carriercode,
      flightnumber: number});
  }

  selectHotel = (price, id, name, location, imageurl) =>{
    this.setState({
      hotelPrice:price,
      hotelSelectID:id,
      hotelname: name,
      hotellocation: location,
      hotelimageurl: imageurl});
  }

  selectCar = (price, type, imageurl) =>{
    this.setState({
      carPrice: price,
      cartype: type,
      carimageurl: imageurl});
  }

  handleProceed = () => {
      this.setState({progress: this.state.progress+1});
      //console.log(this.state.progress);
      Axios({
        method: "POST",
        withCredentials: true,
        url: "http://localhost:5000/hotelsearch",
        data:{
          searchloc: this.state.destination,
          datefrom: this.state.datefrom,
          dateto: this.state.dateto
        }
      }).then((res) => {
        this.setState({ hotels: res.data });
        console.log(res.data);
      });
      //console.log(this.state.searchloc);
      //console.log(this.state.datefrom);
  }
  handleBackProceed = () => {
    this.setState({progress: this.state.progress-1});
    //console.log(this.state.progress);
    
}

handleBook = () => {
    this.setState({progress: this.state.progress+1});

    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/userstatus",
  }).then((res) =>{
      if(!res.data) alert("Please login to proceed")
      if(res.data){
        Axios({
          method: "POST",
          withCredentials: true,
          url: "http://localhost:5000/book",
          data:{
              source: this.state.source,
              destination: this.state.destination,
              datefrom: this.state.datefrom,
              dateto: this.state.dateto,
              hotelId: this.state.hotelSelectID,
              hotelcost: this.state.hotelPrice,
              hotelname: this.state.hotelname,
              hotellocation: this.state.hotellocation,
              hotelimageurl: this.state.hotelimageurl,
              flightcost: this.state.flightPrice,
              flightarrival: this.state.flightarrival,
              flightdeparture: this.state.flightdeparture,
              flightcarriercode: this.state.flightcarriercode,
              flightnumber: this.state.flightnumber,
              carcost: this.state.carPrice,
              cartype: this.state.cartype,
              carimageurl: this.state.carimageurl
          }
        }).then((res) => {
          console.log(res.data);
        });
      }
  });
    
}


  render() {
    return (
      <div>

        <div className="header">
          <NavbarComp />
        </div>

        <div className="search">
        <form action="#">

          <div className="search1" data-panel-bounds="true">

            <div className="destination">
              <div className="search-input">
                <Typeahead
                  id="basic-example"
                  onChange={this.handleSourceChange}
                  options={options}
                  placeholder="Where from?"
                />
              </div>
            </div>

          <div className="separator"></div>

          <div className="destination">
              <div className="search-input">
                <Typeahead
                  id="basic-example"
                  onChange={this.handleDestinationChange}
                  options={options}
                  placeholder="Where to?"
                />
              </div>
            </div>

          <div className="separator"></div>
          
          <div className="dates">

            <div className="checkin">
              <div className="search-input">
                <input type = "date" name = "From" placeholder = "From"  onChange={this.handleDateFromChange}/>
              </div>
            </div>

            <div className="separator"></div>

            <div className="checkout">
              <div className="search-input">
                <input type = "date" name = "To" placeholder = "To"  onChange={this.handleDateToChange}/>
              </div>
            </div>

          </div>

          <div className="button-container">
                <button type="submit" className="search-button" onClick={this.handleSearchClick}><img src="https://icon-library.com/images/white-search-icon-transparent-background/white-search-icon-transparent-background-1.jpg" width="20px" alt="search-icon"/></button>
          </div>
          
          </div>
        </form>
       
        </div>

        <div className="container2">

          <div className="left2">
            {this.state.progress === 2
            ?<select onChange = {this.handleSortChange} name="sortselect" id="sortselect">
            <option value="none" defaultValue disabled hidden> Sort By </option>
            <option value="p-asc">Price (Ascending)</option>
            <option value="p-desc">Price (Descending)</option>
          </select>
            : null}
            <br />
            <hr/>
            <b>Flight Price:</b> $ {this.state.flightPrice}<br/>
            <b>Hotel Price:</b> $ {this.state.hotelPrice} x {this.state.days} nights<br/>
            <b>Car Price:</b> $ {this.state.carPrice} x {this.state.days} days<br/>
            <hr/>

            <b>Subtotal: </b> ${(parseFloat(this.state.flightPrice) + parseFloat(this.state.hotelPrice)*parseInt(this.state.days) + parseFloat(this.state.carPrice)*parseInt(this.state.days))}<br/>
            
            {this.state.progress===1?
            <div>
              <button className="proceed-button" onClick={this.handleProceed}>Proceed ➡</button> <br/>
              <button className="proceed-button" onClick={this.handleBackProceed}>Go Back ⬅</button>
              </div>:
              null}

            {this.state.progress===2?  
            <div>
              <button className="proceed-button" onClick={this.handleProceed}>Proceed ➡</button> <br/>
              <button className="proceed-button" onClick={this.handleBackProceed}>Go Back ⬅</button>
              </div>:
              null}

            {this.state.progress===3?
            this.state.userstatus===false?
            <div>
              <button className="proceed-button" onClick={this.handleBackProceed}>Go Back ⬅</button><br/>

            </div>
            :
            <div>
              <button className="proceed-button" onClick={this.handleBackProceed}>Go Back ⬅</button><br/>
              <button className="proceed-button" onClick={this.handleBook}>Book!</button>
            </div>:null}
            
          </div>
          
          <br />


          <div className="right2">

            {this.state.progress === 0
            ? <h1>Select Dates 	📅 </h1>
            : this.state.progress === 1
            ? <div><h1>Select A Flight ✈️</h1><br />
            <ProgressBar animated now={30} />
            
            {this.state.flights.length === 0? <img src="https://miro.medium.com/max/1158/1*9EBHIOzhE1XfMYoKz1JcsQ.gif" alt="Load"/> : <FlightsComp flights={this.state.flights} selectFlight={this.selectFlight}/>}
            </div>
            : this.state.progress === 2 
            ?<div><h1>Select A Hotel 🏡</h1><br />
            <ProgressBar animated now={60} />
            <HotelsComp hotels={this.state.hotels} datefrom={this.state.datefrom} dateto={this.state.dateto}  selectHotel={this.selectHotel}/></div>
            : this.state.progress === 3
            ? <div><h1>Select A Cab 🚕</h1><br />
            <ProgressBar animated now={90} />
            <CarsComp selectCar={this.selectCar}/></div>
            : <div><ProgressBar animated now={100} />
            <img src="https://thumbs.gfycat.com/QuaintLikelyFlyingfish-size_restricted.gif" alt="Done"/>
            <h1>Booking Complete!</h1></div>}

           <br />
          
      </div>
    </div>

  </div>
);
          }

              
  
}

export default Explore;