import React from 'react';
import './App.css';
import Axios from 'axios';

const displayNames = {'Set2_Blademaster': 'Blademaster', 'Celestial' : 'Lunar',
 'Set2_Glacial' : 'Glacial', 'Set2_Ranger' : 'Ranger'}

class App extends React.Component {
 constructor(props) {
  super(props);
  this.state = {
    comps: []
  }
 }

 replaceName(name) {
  if (name in displayNames) {
    return displayNames[name]
  } else {
    return name
  }
 }

 componentDidMount() {
  Axios.get('http://tft101-dev.us-east-2.elasticbeanstalk.com/comps').then((response)=>{
    console.log(response)
    this.setState({comps: response.data})
  }); 
 }


 render() {
  console.log(this.state.comps)
  return (
    <div className = "App">
      <header className = "App-header">

      <h4>
        TFT101
      </h4>


      </header>
      <div className="compList">
        {this.state.comps.map((comp, i) => {
          console.log(comp)
          var traits = []
          for(var trait of comp.comp) {
            traits.push(this.replaceName(trait[0]))
          }

          return (
            <div className={"comp" + (i % 2)} key={i}>
              <div className="rank">{i+1}</div>
              <div className="traits">{traits.join(', ')}</div>
            </div>)
        })}
      </div>
    </div>
    );
  }
}

export default App;





// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> fuck you.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
