import React, { useState } from 'react';
import { nonRepeatingRandomRoll as randomRole } from './resources'
import { Maybe, StringManipulator as Str } from '@juan-utils/structures';
import { identity } from '@juan-utils/functions';

const Player = (props) => {
  const [ points, setPoints ] = useState(props.points);
  const { name, onRemove, role, onPoint } = props;
  const inc = () => {
    if(role){ 
      setPoints([...points, role]);
      onPoint(role);
    }
  }

  return (
    <li style={{ margin: "16px" }}>
      {name} : {points.length}
      <div style={{ fontSize: "0.8rem" }}>
        {points.join(", ")}
      </div>
      <div>
        <button onClick={inc}>Give Point</button>
        <button onClick={onRemove}>Remove</button>
      </div>
    </li>
  )
}

const createPlayer = (name) => ({ name, points: [] })

const PointTally = ({ role, onPoint }) => {
  const [ name, setName ] = useState("");
  const [ players, setPlayers ] = useState([])
  const handleChange = (e) => setName(e.target.value)
  const handleReset = () => {
    setPlayers([])
    setName("")
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if( name && name.split(",").every(Boolean) ){
      setPlayers([
        ...players,
        ...name.split(",")
                .map(x => x.trim())
                .map(createPlayer)
      ])
      setName("")
    }
  }
  const handlePoint = index => (e) => {
    onPoint(e);
    players[index].points.push(e);
  }

  const removePlayerAt = index => () => setPlayers(players.filter((_,i) => i !== index ))

  return <div>
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={handleChange}/>
      <button>Add player</button>
      <button onClick={handleReset}>Wipe Players</button>
    </form>
    <ul>
      {!players.length ? "No players" : 
        players.map( ({ name, points },index) => <Player
          name={name}
          key={name+index}
          onRemove={removePlayerAt(index)}
          onPoint={handlePoint(index)}
          points={points}
          role={role}
        />)
      }
    </ul>
  </div>
}

function App() {
  const [ hasRole, setHasRole ] = useState(false);
  const [ autoRoll, setAuto ] = useState(false);
  const [ remaining, setRemaining ] = useState(randomRole.remaining);
  const [ role , setRole ] = useState(Maybe.None());
  const pickRole = () => {
    setRole(randomRole());
    setHasRole(true);
    setRemaining(randomRole.remaining())
  }
  const resetRoles = () => {
    randomRole.reset()
    setRemaining(randomRole.remaining())
  }
  const handleAuto = (e) => setAuto(e.target.value)

  return (
    <div style={{ padding: "16px", margin: "8px", fontSize: "1.2rem" }}>
      <div>
        Remaining Roles: { remaining }
      </div>
      <div>
        Current Role: {
          role.isNothing() ? 
          `No role${
            !hasRole ? 
            ". Click pick roll for one" : 
            "s available. Click reset roles to re-shuffle deck"}`
          : role.get()}
      </div>
      <div>
        <button onClick={pickRole}>
          Pick Role
        </button>
        <button onClick={resetRoles}>
          Reset Roles
        </button>
        <input 
          id="auto-roll"
          type="checkbox" 
          value={autoRoll} 
          onChange={handleAuto}
        />
        <label htmlFor="auto-roll">Auto-reroll</label>
      </div>
      <PointTally 
        role={role.get()}
        onPoint={autoRoll ? pickRole : identity}
      />
    </div>
  );
}

export default App;
