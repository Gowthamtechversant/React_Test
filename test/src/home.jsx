import React from 'react';
import './App.css';
import axios from 'axios';
class Home extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
          disable: true,
          value: '',
          data:''
        };
      }

     randomAsteroid =()=>{
        let url = 'https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=DEMO_KEY';
        axios.get(url).then(res =>{
            if(res.status === 200)
            this.setState({data:res.data.near_earth_objects[0]}); 
            else
            this.setState({data:"error"}); 
        });
      }

     submit =()=>{
      let url = 'https://api.nasa.gov/neo/rest/v1/neo/'+this.state.value+'?api_key=AYdynKEnPVpxhUVgbP2YxU0dH0QJTcTkxcMFyMIC';
      axios.get(url).then(res =>{
          console.log(res);
        if(res.status === 200)
        this.setState({data:res.data.near_earth_objects[0]}); 
        else
        this.setState({data:"error"}); 
      }).catch(err =>{
          //console.log(err);
          this.setState({data:"error"}); 
      });
      }

     handleChange =(e)=>{
        if(e.target.value === "")
        this.setState({disable:true, value:e.target.value}); 
        else
        this.setState({disable:false, value:e.target.value}); 
      }
    render() {
        let flag = this.state.data === '' ? true : false;
        switch(flag){
        case true:
            return ( <div>
                <input name="input" type="password" placeholder="Enter Asteroid ID " onChange ={this.handleChange} value={this.state.value} />
                <br />
                <button onClick={this.submit} disabled={this.state.disable}  >Submit</button>
                <button onClick={this.randomAsteroid}>Random Asteroid </button>
                </div>);
           break;
        case false:
            if(this.state.data === "error")
            return <h4>No Data Found</h4>;
            else      
              return  (  <div className ="Content">
        <h6>Name &nbsp; : &nbsp;  {this.state.data.name}</h6>
        <h6>Nasa jpl url &nbsp; : &nbsp; <a>{this.state.data.nasa_jpl_url}</a></h6>
        <h6>Potentially hazardous asteroid &nbsp; : &nbsp;  {this.state.data.is_potentially_hazardous_asteroid ? 'Yes' : 'No'} </h6>
       </div>  );
       break;
       default:
           return (<h4>Welcome to React</h4>);
    }
}
  }

export default Home;
