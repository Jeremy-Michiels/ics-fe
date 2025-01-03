import { useEffect, useState } from 'react';
import '../css/App.css';
import '../css/bootstrap.min.css'
import FilForm from './FilForm.js'
import SiteLogo from '../misc/getsitelogo.png'
import EmailForm from './EmailForm.js';

function App() {
  let [fForm, setFForm] = useState(true);
  let [titel, setTitel] = useState("");
  let [locatie, setLocatie] = useState("");
  let [mailBericht, setMailBericht] = useState("");
  let [stDate, setStDate] = useState(Date.now);
  let [enDate, setEnDate] = useState(Date.now);
  let [online, setOnline] = useState(false);
  let [emails, setEmails] = useState([{
    id: 1,
    mail: "",
    reistijdB: false
  }]);
  var [reistijdB, setReisTijdB] = useState(false)
  var [reistijd, setReisTijd] = useState("00:00");
  let [meetingTijd, setMeetingTijd] = useState("00:00")
  let [isLoaded, setIsLoaded] = useState(false)
  let [login, setLogin] = useState({})
  let [isFetching, setIsFetching] = useState(false)

  function fetcher(){
    setIsFetching(true);
    fetch("http://localhost:5162/XOutlookApi/GetBearerToken")
      .then(x => x.json())
      .then((result) => {
        setLogin(result)
        setIsLoaded(true)
        setIsFetching(false)
      }, (error) => {
        
      })
  }

  

  
  useEffect(() => {
    if(!isLoaded && !isFetching){
      fetcher()
    }
  })


  if(!isLoaded){
    return(<div className='App loadingScreen fading'>
    <div className='container-flex'>
        <div className='row'>
          <div className='col'>
            <img src={SiteLogo} style={{width: 400}}></img>
          <div className='loader' >
            
</div>
<h1>Log in bij Microsoft om de applicatie te gebruiken</h1>
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            
          </div>
        </div>

      
    </div>
    </div>)
  }

  return (
    
    <div className='fading'>
    <div className='header ps-5'>
      <div className='row'>
        <div className='col'>
        <img src={SiteLogo} style={{height: 50}}></img>
        </div>
        
        <div className='col text-end p-3 pe-5'>
          <h5>Ingelogd als: {login.userName}</h5>
        </div>
      </div>
      
    </div>
    <div className="App">
      {fForm === true ? <>
        <FilForm 
        check={fForm} setCheck={setFForm} 
        titel={titel} setTitel={setTitel} 
        locatie={locatie} setLocatie={setLocatie} 
        mailBericht={mailBericht} setMailBericht={setMailBericht} 
        stDate={stDate} setStDate={setStDate} 
        enDate={enDate }setEnDate={setEnDate}
        online={online} setOnline={setOnline}
        reistijdB={reistijdB} setReisTijdB={setReisTijdB}
        reistijd={reistijd} setReisTijd={setReisTijd}
        meetingTijd={meetingTijd}setMeetingTijd={setMeetingTijd}
        emails={emails} setEmails={setEmails}

        ></FilForm>
        </> : <>
        <EmailForm 
        check={fForm} setCheck={setFForm} 
        titel={titel} setTitel={setTitel} 
        locatie={locatie} setLocatie={setLocatie} 
        mailBericht={mailBericht} setMailBericht={setMailBericht} 
        stDate={stDate} setStDate={setStDate} 
        enDate={enDate }setEnDate={setEnDate}
        online={online} setOnline={setOnline}
        reistijdB ={reistijdB}
        emails={emails} setEmails={setEmails}
        bearer={login}
        meetingTijd = {meetingTijd} 
        reistijd = {reistijd}
        ></EmailForm>
        </>}
      
    </div>
    </div>
  );
}

export default App;
