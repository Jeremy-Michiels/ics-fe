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
  let [list, setList] = useState([]);
  let [excelList, setExcelList] = useState(false)
  let [excelSelected, setExcelSelected] = useState({})
  let [newerList, setNewerList] = useState([])
  let [api, setApi] = useState("http://localhost:5000")


  //Fetcht de bearer token vanaf de API
  function fetcher(apiT){
    setIsFetching(true);
    let call = ""
    if(apiT !== undefined && apiT !== null){
      call = apiT
    }
    else{
      call = api
    }
    fetch(call + "/XOutlookApi/GetBearerToken")
      .then(x => x.json())
      .then((result) => {
        setLogin(result)
        setIsLoaded(true)
        setIsFetching(false)
      }, (error) => {
        var item = prompt("Op welke localhost poort kunnen we de API bereiken? Zoek hiervoor bij het geopende bestand naar de regels Now listening on: http:localhost:.... ", "")
        if(item.includes("http://localhost:")){
          setApi(item)
        }
        else{
          setApi("http://localhost:" + item)
        }
        fetcher("http://localhost:" + item)

      })
  }
  
  //Maakt een lijst van alle items in de opgestuurde excel lijst, die nog geen geplande datum hebben
  function newerListSetter(newList){
    var newItems = newList.filter(y => {
      if(y["Definitieve datum"] === undefined){
          return true
      }
      else{
          return false
      }
  })
  
  setNewerList(newItems)
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
            <img src={SiteLogo} style={{width: 400}} alt='Logo website'></img>
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
    <>
    <div className='fading'>
    <div className='header ps-5'>
      <div className='row'>
        <div className='col'>
        <img src={SiteLogo} style={{height: 50}} alt='Logo website'></img>
        </div>
        
        <div className='col text-end p-3 pe-5'>
          <h5>Ingelogd als: {login.userName}</h5>
        </div>
      </div>
      
    </div>
    <div className="App">
      {fForm === true ? <>
        <FilForm 
        api={api}
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
        list ={list} setList={setList}
        excelSelected={excelSelected} setExcelSelected={setExcelSelected}
        excelList={excelList} setExcelList={setExcelList}
        newerList={newerList} setNewerList={setNewerList}
        newerListSetter={newerListSetter}

        ></FilForm>
        </> : <>
        <EmailForm 
        api={api}
        check={fForm} setCheck={setFForm} 
        titel={titel} setTitel={setTitel} 
        locatie={locatie} setLocatie={setLocatie} 
        mailBericht={mailBericht} setMailBericht={setMailBericht} 
        stDate={stDate} setStDate={setStDate} 
        enDate={enDate }setEnDate={setEnDate}
        online={online} setOnline={setOnline}
        reistijdB ={reistijdB} setReisTijdB ={setReisTijdB}
        emails={emails} setEmails={setEmails}
        bearer={login} setBearer={setLogin}
        meetingTijd = {meetingTijd} setMeetingTijd={setMeetingTijd}
        reistijd = {reistijd}setReisTijd={setReisTijd}
        list={list} setList={setList}
        excelList = {excelList}
        excelSelected={excelSelected} setExcelSelected={setExcelSelected}
        newerListSetter={newerListSetter}
        newerList={newerList} setNewerList={setNewerList}
        ></EmailForm>
        </>}
      
    </div>
    </div>
    </>
  );
}

export default App;
