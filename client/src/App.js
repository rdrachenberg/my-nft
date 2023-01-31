import { useEffect, useState} from 'react';
import './App.css';
import {PhotoEditorSDK} from './components/PhotoEditer';


function App() {
  const [activate, setActivate] = useState(false);
  
  const activateEditor = () => {
    setActivate(!activate);
  }
  
  return (
    <div className="App">
     <h1>Hello from the React side ;-)</h1>

     <div>
     <button onClick={activateEditor}>Here is the button</button>
     </div>
      {activate ? 
        <div><PhotoEditorSDK /></div>
      :
        <></>
      }
    </div>
  );
}

export default App;
