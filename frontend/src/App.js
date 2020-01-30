import React from 'react';
import './App.css';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'


const displayNames = {'Set2_Blademaster': 'Blademaster', 'Celestial' : 'Lunar',
 'Set2_Glacial' : 'Glacial', 'Set2_Ranger' : 'Ranger', 'Wind' : 'Cloud', 'Metal' : 'Steel', 'Set2_Assassin': 'Assassin'}

const champNames = {'KogMaw': 'Kog\'Maw', "Leblanc": "LeBlanc", "RekSai": "Rek'Sai", "DrMundo": "Dr. Mundo", "TFT2_Amumu": "Amumu", "TFT2_Karma": "Karma", "TFT2_Leona": "Leona", "MasterYi": "Master Yi", "TFT2_Senna": "Senna"}

const champUrlNames = {"TFT2_Amumu": "Amumu", "TFT2_Karma": "Karma", "TFT2_Leona": "Leona", "TFT2_Senna": "Senna"}

const traitLevels = {
  'Alchemist' : 1,
  'Assassin' : 2,
  'Avatar' : 1,
  'Berserker' : 2,
  'Blademaster' : 3,
  'Cloud' : 3,
  'Crystal' : 2,
  'Desert' : 2,
  'Druid' : 1,
  'Electric' : 3,
  'Inferno' : 3,
  'Light' : 3,
  'Lunar' : 1,
  'Mage' : 2,
  'Mountain' : 1,
  'Mystic' : 2,
  'Ocean' : 3,
  'Poison' : 1,
  'Predator' : 1,
  'Shadow' : 2,
  'Soulbound' : 1,
  'Steel' : 3,
  'Summoner' : 2,
  'Warden' : 3,
  'Woodland' : 2,
  'Glacial': 3,
  'Ranger': 3,
}

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
  return images;
}

const images = importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));

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

 formatChampName(name) {
  if (name in champNames) {
    return champNames[name]
  } else {
    return name;
  }
 }

 getChampUrlName(name) {
  if (name in champUrlNames) {
    return champUrlNames[name]
  } else {
    return name;
  }
 }

 getCompColor(name, level) {
  if (traitLevels[name] === 1) {
    return 'goldHex';
  } else if (traitLevels[name] === 2){
    if(level === 1){
      return 'bronzeHex';
    }else if(level === 2){
      return 'goldHex' ;
    }
  }else if(traitLevels[name] === 3){
    if(level === 1){
      return 'bronzeHex';
    }else if(level === 2){
      return 'silverHex';
    }else if(level === 3){
      return 'diamondHex';
    }
  }
 }

 componentDidMount() {
  Axios.get('https://api.tft101.com/comps?n=5').then((response)=>{
    console.log(response)
    this.setState({comps: response.data.map(c => {
      c.active = false;
      return c;
    })})
  });
  Axios.get('https://ddragon.leagueoflegends.com/api/versions.json').then((response)=>{
    console.log(response)
    this.setState({version: response.data[0]})
  }) 
 }

 toggleDropdown(index) {
  var newComps = this.state.comps.map(a => Object.assign({}, a));
  newComps[index].active = !newComps[index].active;
  this.setState({comps: newComps})
 }

 render() {
  console.log(images);
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
            traits.push([this.replaceName(trait[0]), trait[1]])
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
                        <div className={"traitImageHex " + this.getCompColor(trait[0], trait[1])}></div>
                        <img className="traitImage" src = {images[trait[0] + '_TFT_icon.png']}/>
                        <div className="traitText">{trait[0]}</div>
                      </div> 
                      )
                  })}
                </div>
                <div className="traitWinrate">{Math.round(comp.weighted_winrate * 1000) / 10 + '%'}<FontAwesomeIcon style={{marginLeft: '20px', marginRight: '20px'}} icon={faAngleDown} /></div>
              </div>
              {this.state.comps[i].active && 
                <div className="compDetails">
                  {comp.champs.map(champ => {
                    return (
                      <div className="champ">
                        <img className="champImage" src={"http://ddragon.leagueoflegends.com/cdn/" + this.state.version + "/img/champion/" + this.getChampUrlName(champ[0]) + ".png"}/>
                        <div>{this.formatChampName(champ[0]) + ': '}</div>
                        <div>{Math.round(champ[1] * 1000) / 10 + '%'}</div>
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
