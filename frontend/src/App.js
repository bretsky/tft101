import React from 'react';
import './App.css';
import Axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons'


const traitDisplayNames = {'Set2_Blademaster': 'Blademaster', 'Celestial' : 'Lunar', 'Set2_Glacial' : 'Glacial', 'Set2_Ranger' : 'Ranger', 'Wind' : 'Cloud', 'Metal' : 'Steel', 'Set2_Assassin': 'Assassin', 'Set3_Brawler': 'Brawler', 'Set3_Sorcerer': 'Sorcerer', 'MechPilot': 'Mech-Pilot', 'StarGuardian': 'Star Guardian', 'Set3_Blademaster': 'Blademaster', 'Set3_Void': 'Void', 'Set3_Celestial': 'Celestial', 'Set3_Mystic': 'Mystic', 'SpacePirate': 'Space Pirate', 'ManaReaver': 'Mana-Reaver', 'DarkStar': 'Dark Star'}

const traitUrlNames = {'Set2_Blademaster': 'Blademaster', 'Celestial' : 'Lunar', 'Set2_Glacial' : 'Glacial', 'Set2_Ranger' : 'Ranger', 'Wind' : 'Cloud', 'Metal' : 'Steel', 'Set2_Assassin': 'Assassin', 'Set3_Brawler': 'Brawler', 'Set3_Sorcerer': 'Sorcerer', 'Set3_Blademaster': 'Blademaster', 'Set3_Void': 'Void', 'Set3_Celestial': 'Celestial', 'Set3_Mystic': 'Mystic'}

const champNames = {'KogMaw': 'Kog\'Maw', "Leblanc": "LeBlanc", "RekSai": "Rek'Sai", "DrMundo": "Dr. Mundo", "TFT2_Amumu": "Amumu", "TFT2_Karma": "Karma", "TFT2_Leona": "Leona", "MasterYi": "Master Yi", "TFT2_Senna": "Senna", "TFT3_Malphite": "Malphite", "TFT3_Blitzcrank": "Blitzcrank", "TFT3_Lucian": "Lucian", "TFT3_Ezreal": "Ezreal", "TFT3_Vi": "Vi", "TFT3_Jinx": "Jinx", "Chogath": "Cho'Gath", "TFT3_MissFortune": "Miss Fortune", "TFT3_Thresh": "Thresh", "TFT3_Lulu": "Lulu", "TFT3_Graves": "Graves", "TFT3_Ekko": "Ekko", "TFT3_Zoe": "Zoe", "TFT3_Ahri": "Ahri", "TFT3_Annie": "Annie", "TFT3_Rumble": "Rumble", "TFT3_Syndra": "Syndra", "TFT3_VelKoz": "Vel'Koz", "TFT3_Fizz": "Fizz", "TFT3_Gangplank": "Gangplank", "TFT3_Lux": "Lux", "TFT3_TwistedFate": "Twisted Fate", "TFT3_Sona": "Sona", "TFT3_Poppy": "Poppy", "TFT3_Soraka": "Soraka", "TFT3_Neeko": "Neeko", "TFT3_Fiora": "Fiora", "TFT3_Leona": "Leona", "TFT3_Irelia": "Irelia", "TFT3_Kayle": "Kayle", "TFT3_KaiSa": "Kai'Sa", "Khazix": "Kha'Zix", "TFT3_Shaco": "Shaco", "TFT3_Shen": "Shen", "TFT3_Ashe": "Ashe", "TFT3_Caitlyn": "Caitlyn", "TFT3_WuKong": "Wukong", "TFT3_Jhin": "Jhin", "TFT3_Kassadin": "Kassadin", "TFT3_XinZhao": "Xin Zhao", "TFT3_Jayce": "Jayce", "TFT3_Karma": "Karma", "TFT3_Mordekaiser": "Mordekaiser", "TFT3_JarvanIV": "Jarvan IV"}

const champUrlNames = {"TFT2_Amumu": "Amumu", "TFT2_Karma": "Karma", "TFT2_Leona": "Leona", "TFT2_Senna": "Senna", "TFT3_Malphite": "Malphite", "TFT3_Blitzcrank": "Blitzcrank", "TFT3_Lucian": "Lucian", "TFT3_Ezreal": "Ezreal", "TFT3_Vi": "Vi", "TFT3_Jinx": "Jinx", "Chogath": "ChoGath", "TFT3_MissFortune": "MissFortune", "TFT3_Thresh": "Thresh", "TFT3_Lulu": "Lulu", "TFT3_Graves": "Graves", "TFT3_Ekko": "Ekko", "TFT3_Zoe": "Zoe", "TFT3_Ahri": "Ahri", "TFT3_Annie": "Annie", "TFT3_Rumble": "Rumble", "TFT3_Syndra": "Syndra", "TFT3_VelKoz": "VelKoz", "TFT3_Fizz": "Fizz", "TFT3_Gangplank": "Gangplank", "TFT3_Lux": "Lux", "TFT3_TwistedFate": "TwistedFate", "TFT3_Sona": "Sona", "TFT3_Poppy": "Poppy", "TFT3_Soraka": "Soraka", "TFT3_Neeko": "Neeko", "TFT3_Fiora": "Fiora", "TFT3_Leona": "Leona", "TFT3_Irelia": "Irelia", "TFT3_Kayle": "Kayle", "TFT3_KaiSa": "Kai'Sa", "Khazix": "Kha'Zix", "TFT3_Shaco": "Shaco", "TFT3_Shen": "Shen", "TFT3_Ashe": "Ashe", "TFT3_Caitlyn": "Caitlyn", "TFT3_WuKong": "WuKong", "TFT3_Jhin": "Jhin", "TFT3_Kassadin": "Kassadin", "TFT3_XinZhao": "Xin Zhao", "TFT3_Jayce": "Jayce", "TFT3_Karma": "Karma", "TFT3_Mordekaiser": "Mordekaiser", "TFT3_JarvanIV": "Jarvan IV"}

const traitLevels = {
  'Blademaster': 3,
  'Blaster': 2,
  'Brawler': 2,
  'Celestial': 3,
  'Chrono': 3,
  'Cybernetic': 2,
  'Dark Star': 2,
  'Demolitionist': 1,
  'Infiltrator': 2,
  'Mana-Reaver': 2,
  'Mech-Pilot': 1,
  'Mercenary': 1,
  'Mystic': 2,
  'Protector': 2,
  'Rebel': 2,
  'Sniper': 1,
  'Sorcerer': 3,
  'Space Pirate': 2,
  'Star Guardian': 2,
  'Starship': 1,
  'Valkyrie': 1,
  'Vanguard': 2,
  'Void': 1
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
  if (name in traitDisplayNames) {
    return traitDisplayNames[name]
  } else {
    return name;
  }
 }

 getTraitUrlName(name) {
  if (name in traitUrlNames) {
    return traitUrlNames[name]
  } else {
    return name;
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
 }Oof

 componentDidMount() {
  Axios.get('https://api.tft101.com/comps?n=30').then((response)=>{
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
                        <img className="traitImage" src = {this.getTraitUrlName(images[trait[0] + '_TFT_icon.png'])}/>
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
