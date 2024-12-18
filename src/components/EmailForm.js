import { useState } from "react";


function EmailForm(props){

    let nextId=2;

    let [loading, setLoading] = useState(false)
    let [list, setList] = useState([]);
    let [disDates, setDisDates] = useState([])


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

    .then(res => res.json())
    .then(y => {
        setList(y)
        checkDate(y)
        setLoading(false)
    });
    }

    function checkDate(list){
        var dis = []
        list.forEach(z => {
            if(!dis.includes(z.datum)){
                dis.push(z.datum)
            }
        })
        dis = dis.sort()
        setDisDates(dis)
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
                            console.log(h)
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
                        return<div key={d}>
                            <h3>{weekday[da.getDay()] + " " + da.toLocaleDateString("nl")}</h3>
                            <div className="row border border-white p-2 m-2">
                                {list.map(i => {
                                    if(i.datum === d){
                                        return (
                                            <>
                                            <button className="btn btn-secondary col-sm-4 border border-dark p-2 m-1">
                                                <h5>{i.startTijd} - {i.eindTijd}</h5>
                                            </button>
                                            </>
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
        </div>
        </>
    )
}
export default EmailForm