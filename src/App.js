import { useState } from 'react';
import './css/App.css';
import './css/bootstrap.min.css'
import FilForm from './FilForm.js'
import SiteLogo from './misc/getsitelogo.png'

function App() {
  let [fForm, setFForm] = useState(true);
  let [titel, setTitel] = useState("");
  let [locatie, setLocatie] = useState("");
  let [mailBericht, setMailBericht] = useState("");
  let [stDate, setStDate] = useState(Date.now);
  let [enDate, setEnDate] = useState(Date.now);



  return (
    
    <>
    <div className='header ps-5'>
      <img src={SiteLogo} style={{height: 50}}></img>
    </div>
    <div className="App">
      {fForm === true ? <>
        <FilForm check={fForm} setCheck={setFForm} 
        titel={titel} setTitel={setTitel} 
        locatie={locatie} setLocatie={setLocatie} 
        mailBericht={mailBericht} setMailBericht={setMailBericht} 
        stDate={stDate} setStDate={setStDate} 
        enDate={enDate }setEnDate={setEnDate}></FilForm>
        </> : <>
        test
        <h1>{titel}</h1>
        </>}
      
    </div>
    </>
  );
}

export default App;
