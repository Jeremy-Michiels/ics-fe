import { useRef, useState } from "react";
import * as XLSX from "xlsx"


function EmailForm(props){

    let nextId=2;

    let [loading, setLoading] = useState(false)
    let [list, setList] = useState([]);
    let [disDates, setDisDates] = useState([])
    let [selDate, setSelDate] = useState({})
    let [newerList, setNewerList] = useState([])

    let modalRef = useRef();
    let startTijd = useRef();
    let eindTijd = useRef();


    const weekday = ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];

    function fetchAva(){
        var mails = []
        props.emails.forEach(z => {
            mails.push(z.mail)
        })
        let body = {
            emails: mails,
            startTime: new Date(props.stDate + " 09:00:00"),
            endTime: new Date(props.enDate + " 18:00:00"),
            meetingTime: props.meetingTijd,
            tijdWeg: props.reistijd
        }
    setLoading(true)
    fetch("http://localhost:5162/ICS/GetAvailability?bearerToken=" + props.bearer.accessToken, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
        
    })

    .then(res => {
        if(res.ok){
            return res.json().then((result) => {
                setList(result)
                checkDate(result)
                setLoading(false)
            })
        }
        else{
            
            return res.text().then((error) => {
                alert(error)
                setLoading(false)
            })
        }
        
    })
    }

    function selecter(sel){
        props.setExcelSelected(sel)
        props.setTitel("Workshop " + sel["Workshop Nummer"] + ": " + sel["Workshop Naam"])
        var uur = Math.round((sel["Tijdsindicatie"] * 24))
        var min = ((sel["Tijdsindicatie"] * 24) - uur) * 60
        if(min < 0){
            uur = uur - 1
            min = min * -1
        }
        if(uur < 10){
            uur = "0" + uur
        }
        if(min < 10){
            min = "0" + min
        }
        props.setMeetingTijd(uur + ":" + min)
        let id = 0;
        let emails = sel["Deelnemers"] === undefined ? [] : sel["Deelnemers"].split(";").map(y => {
            id++;
            return {
                id: id,
                mail: y,
                reistijdB: false,
            }
        })
        props.setEmails(emails)
        modalRef.current.style.display = "none";
                        props.setLocatie("")
                        props.setMailBericht("")
                        props.setStDate(new Date(props.enDate).toLocaleDateString())
                        props.setEnDate("")
                        props.setOnline(false)
                        props.setReisTijdB(false)
                        props.setReisTijd("00:00")
                        props.setCheck(true)
    }


    function checkDate(list){
        var dis = []
        list.forEach(z => {
            let date = new Date(z.datum).setHours(0);
            if(!dis.includes(date)){
                dis.push(date)
            }
        })
        
        dis = dis.sort()
        setDisDates(dis)
        
    }

    function agenda(){
        // fetch()

            var checker = false;
            var newList = props.list.map(y => {
                if(y["Workshop Nummer"] === props.excelSelected["Workshop Nummer"]){
                    checker = true;
                    let emailsOnString = ""
                    props.emails.forEach(x => {emailsOnString = emailsOnString + x.mail + ";"})
                    var uur = Math.round((y["Tijdsindicatie"] * 24))
                    var min = ((y["Tijdsindicatie"] * 24) - uur) * 60
                    if(min < 0){
                        uur = uur - 1
                        min = min * -1
                    }
                    if(uur < 10){
                        uur = "0" + uur
                    }
                    if(min < 10){
                        min = "0" + min
                    }
                    return {
                        ...y,
                        "Definitieve datum": new Date(selDate.datum).toLocaleDateString("nl") + " om " + selDate.startTijd,
                        "Deelnemers": emailsOnString,
                        "Tijdsindicatie": uur + ":" + min

                    }
                }
                else{
                    return y
                }
            })
            if(checker === false){
                let emailsOnString = ""
                props.emails.forEach(x => {emailsOnString = emailsOnString + x.mail + ";"})
                newList.push({
                    "Workshop Nummer": props.list.length + 1,
                    "Workshop Naam": props.titel,
                    "Functionele groepen": "",
                    "Processen": "",
                    "Opmerking": "",
                    "Tijdsindicatie": props.meetingTijd,
                    "Definitieve datum": new Date(selDate.datum).toLocaleDateString("nl") + " om " + selDate.startTijd,
                    "Deelnemers": emailsOnString
                })
            }
            props.setList(newList);

            var newItems = newList.filter(y => {
                if(y["Definitieve datum"] === undefined){
                    return true
                }
                else{
                    return false
                }
            })
            
            setNewerList(newItems)
            modalRef.current.style.display = "block"
        
        
    }

    

    return (
        <>
        <div className='container'>
            <div className="row" style={{position: "absolute", top: 100}}>
                <button className="btn btn-primary" onClick={() => {
                    props.setCheck(true)}}>Terug</button>
            </div>
          <div className='row' >
            <div className='col'>
              <h3>{props.titel}</h3>
            </div>
            <div className='col'>
                {props.online ? <>Online</> : <>{props.locatie}</>}
                      
            </div>
          </div>
          <div className='row'>
            <div className='col'>
              <h5>{props.stDate} - {props.enDate}</h5>
            </div>
          </div>
          <div className='row mt-5'>
            <div className='col-sm-4 p-2'>
            <div className="row">
              <h2>Emails</h2>
              {props.emails.map(e => {
                return <div key={e.id} className="row p-1 m-1 border border-white">
                <div className="col p-1">
                <input type='text' className='form-control' defaultValue={e.mail} placeholder="Vul een emailadres in" onChange={(f) => {
                    let newMails = props.emails.map(g => {
                        if(e.id === g.id){
                            let h = {
                                ...g,
                                mail: f.target.value,
                            }
                            return h
                            
                        }
                        else{
                            return g;
                        }
                    })
                    props.setEmails(newMails)
                }}></input>
                </div>




                {props.reistijdB ? <>
                <div className="col-sm-4">
                    <div className="row">
                        
                            <div className="col-sm-1">
                        <input type="checkbox" defaultChecked={e.reistijd} onChange={(y) => {
                            let newMails = props.emails.map(g => {
                                if(e.id === g.id){
                                    let h = {
                                        ...g,
                                        reistijd: y.target.checked,
                                    }
                                    return h
                                    
                                }
                                else{
                                    return g;
                                }
                            })
                            props.setEmails(newMails)
                        }}></input>
                        </div>
                        <div className="col-sm-7">
                            <h6>Reistijd meerekenen</h6>
                        </div>
                        
                        
                    
                    </div>
                    
                    
                </div>
                </> : <></>}






                </div>
              })}
              </div>
              <div className="text-bottom">
              <div className="row">
                <div className="col">
                <button className="btn btn-primary" onClick={fetchAva}>
                    Versturen
                </button>
                </div>
                <div className="col">
                    <button className="btn btn-success" onClick={() => {
                        props.setEmails([
                            ...props.emails,
                            {
                            id: nextId++,
                            mail: "",
                            reistijd: false,
                        }])
                    }}>
                        Email toevoegen
                    </button>
                </div>
              </div>
              </div>
            </div>
            <div className="col ms-3 p-2">
                <div className="row">
                <h2>Resultaten</h2>
                {loading ? <div className="text-center">

                <div className="loader">

                </div>
                
                </div> : <></>}
                {list.length > 0 ? <>
                
                <div className="row border border-white m-1 p-1 ">
                    {disDates.map(d => {
                        var da = new Date(d)
                        return<div key={weekday[da.getDay()] + " " + da.toLocaleDateString("nl")}>
                            <h3>{weekday[da.getDay()] + " " + da.toLocaleDateString("nl")}</h3>
                            <div className="row border border-white p-2 m-2">
                                {list.map(i => {
                                    if(new Date(i.datum).toLocaleDateString("nl") === da.toLocaleDateString()){
                                        return (
                                        
                                            <button className="btn btn-secondary col-sm-4 border border-dark p-2 m-1" onClick={() => {
                                                setSelDate(i)
                                                if(startTijd.current !== undefined && startTijd.current !== null){
                                                    startTijd.current.value = i.startTijd
                                                    eindTijd.current.value = i.eindTijd
                                                }
                                            }} key={weekday[da.getDay()] + " " + da.toLocaleDateString("nl") + " " + i.startTijd + " - " + i.eindTijd}>
                                                <h5>{i.startTijd} - {i.eindTijd}</h5>
                                            </button>
                                            
                                        )
                                    }
                                    return (
                                <></>)
                                })}
                                
                            </div>
                        </div>
                    })}
                </div>
                </> : <></>}
                </div>
            </div>
          </div>
          {selDate.datum !== undefined ? <>
          <div className="row mt-5 mb-3 p-3 border text-center" >
            
            
            <h1>{new Date(selDate.datum).toLocaleDateString("nl")}</h1>
            <div className="col">
                Van:
                <input type="time" defaultValue={selDate.startTijd} ref={startTijd}></input>
            </div>
            <div className="col">
                Tot: 
                <input type="time" defaultValue={selDate.eindTijd} ref={eindTijd}></input>
            </div>
            <div>
            <button className="btn btn-success" onClick={agenda}>
                Versturen
            </button>
            </div>
            
            </div>
            </> : <></>}


            <div className="modal" ref={modalRef}>
        <div className="modal-content" style={{color: "black"}}>
            <p>Uitnodiging is verstuurd.</p>
            {props.excelList === true ? <>
                {newerList.length > 0 ? <>
                    <div className="row m-3 p-2">
                    Volgende item om in te plannen:
                    </div>
                    <div className="row">
                <div className="col">
                    Workshop Nummer
                </div>
                <div className="col">
                    Workshop Naam
                </div>
                <div className="col">
                    
                </div>
            </div>
                    {newerList.map(i => {
                        return <div key={newerList["Workshop Nummer"]}>
                            <div className="row m-2 p-1 border border-black border-solid" >
                                <div className="col">
                                    {i["Workshop Nummer"]}
                                </div>
                                <div className="col">
                                    {i["Workshop Naam"]}
                                </div>
                                <div className="col">
                                    <button className="btn btn-primary" onClick={() => selecter(i)}>
                                        Selecteer
                                    </button>
                                </div>

                            </div>
                        </div>
                    })}
                    <div className="row m-3 p-2"></div>
                    
                    
                </> : <></>}
            

            </> : <></>}
        <div className="row">
            <div className="col">
                    <button className="btn btn-primary" onClick={() => {
                        props.setTitel("")
                        props.setEmails([])
                        props.setLocatie("")
                        props.setMailBericht("")
                        props.setStDate(new Date(props.enDate).toLocaleDateString())
                        props.setEnDate("")
                        props.setOnline("")
                        props.setReisTijdB(false)
                        props.setReisTijd("00:00")
                        props.setMeetingTijd("00:00")
                        props.setExcelSelected({})
                        props.setCheck(true)

                        }}>Nog een item toevoegen</button>
            </div>
            <div className="col">
                <button className="btn btn-success" onClick={() => {
                    var wb = XLSX.utils.book_new() ; 
                    console.log(props.list)
                    var ws = XLSX.utils.json_to_sheet(props.list)
                    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
                    XLSX.writeFile(wb, "download.xlsx")
                }}>
                    Exporteren naar Excel
                </button>
            </div>
        </div>
        </div>
        </div>


        </div>
        </>
    )
}
export default EmailForm