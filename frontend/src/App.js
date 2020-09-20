import React from 'react';
import './App.css';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'

// const ENDPOINT = "https://api.tft101.com";
const ENDPOINT = "http://localhost:1999";

class App extends React.Component {
 constructor(props) {
  super(props);
  this.state = {
    comps: []
  }
 }

 urlEncodeChampName(name) {
  if (name === "Wukong") {
    return "MonkeyKing";
  }
  return name.replace(' ', '').replace("'", '');
 }

 componentDidMount() {
  const urlParams = new URLSearchParams(window.location.search);
  const specificComp = urlParams.get('comp');
  if (specificComp !== null) {
    Axios.get(ENDPOINT + '/comps?n=30&comp=' + specificComp).then((response)=>{
      console.log(response)
      this.setState({comps: response.data.map(c => {
        c.active = false;
        return c;
      })})
    });
  } else {
    Axios.get(ENDPOINT + '/comps?n=30').then((response)=>{
      console.log(response)
      this.setState({comps: response.data.map(c => {
        c.active = false;
        return c;
      })})
    });
  }
  Axios.get('https://ddragon.leagueoflegends.com/api/versions.json').then((response)=>{
    console.log(response)
    this.setState({version: response.data[0]})
  })
  Axios.get(ENDPOINT + '/traits').then((response)=>{
    console.log(response)
    this.setState({traits: response.data})
  })
  Axios.get(ENDPOINT + '/champions').then((response)=>{
    console.log(response)
    this.setState({champions: response.data})
  })
 }

 toggleDropdown(index) {
  var newComps = this.state.comps.map(a => Object.assign({}, a));
  newComps[index].active = !newComps[index].active;
  this.setState({comps: newComps})
 }

 render() {
  // console.log(this.state.comps)
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
            traits.push([trait[0], trait[1]])
          }
          console.log(traits)
          return (
            <div>
              <div onClick={() => this.toggleDropdown(i)} className={"comp" + (i % 2)} key={i}>
                <div className="rank">{i+1}</div>
                <div className="traits">
                  {traits.map(trait => {
                    return (
                      <div className="trait">
                        <img className="traitImage" src = {ENDPOINT + "/trait/" + trait[0] + "/image?n=" + trait[1]}/>
                        <div className="traitText">{this.state.traits[trait[0]]}</div>
                      </div> 
                      )
                  })}
                </div>
                <div className="traitWinrate">{Math.round(comp.weighted_winrate * 1000) / 10 + '%'}<FontAwesomeIcon style={{marginLeft: '20px', marginRight: '20px'}} icon={faAngleDown} /></div>
              </div>
              {this.state.comps[i].active && 
                <div className="compDetails">
                  {comp.champs.map(champ => {
                    champ[2] = champ[2].slice(0, 6);
                    var original_length = champ[2].length
                    for (var i=0; i < (6 - original_length); i++) {
                      champ[2].push([-1, -1]);
                    }
                    return (
                      <div className="champ">
                        <span class="mytooltip tooltip-effect-1">
                          <img className="champImage tooltip-item" src={"http://ddragon.leagueoflegends.com/cdn/" + this.state.version + "/img/champion/" + this.urlEncodeChampName(this.state.champions[champ[0]]) + ".png"}/>
                          <div>{this.state.champions[champ[0]] + ': '}</div>
                          <div>{Math.round(champ[1] * 1000) / 10 + '%'}</div>
                          <span class="tooltip-content clearfix">
                              {champ[2].map(item => {
                                if (item[0] === -1) {
                                  return (
                                      <img className="item-image empty-image" src={ENDPOINT + "/items/01"}/>
                                    )
                                } else {
                                  return (
                                      <img className="item-image" src={ENDPOINT + "/items/" + item[0]}/>
                                    )
                                }
                              })}
                          </span>
                        </span>
                      </div>
                      )
                  })}
                </div>
              }
            </div>
            )
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
