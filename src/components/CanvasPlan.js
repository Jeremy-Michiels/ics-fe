import { useRef, useState } from "react";

function CanvasPlan(props){

    let [start, setStart] = useState(false)
    let [loading, setLoading] = useState(false)
        let [list, setList] = useState([]);
        let [disDates, setDisDates] = useState([])
        let [selDate, setSelDate] = useState({})
        let [meetingTijd, setMeetingTijd] = useState("00:00")
        let [reistijd, setReisTijd] = useState("00:00")
        let [locatie, setLocatie] = useState("")
        let [online, setOnline] = useState(false)
        let [reistijdB, setReisTijdB] = useState(false)

        let startTijd = useRef();
            let eindTijd = useRef();
            

        const weekday = ["Zondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrijdag","Zaterdag"];

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

    function fetchAva(){
            if((!online && locatie !== "") || online){
                            if(meetingTijd !== "00:00"){
                                if((reistijdB === false || (reistijdB === true && !online && reistijd !== "00:00") || online)){
                                    

                                    setStart(true)
                                    setLoading(true)
                                    var mails = []
                                    props.emails.forEach(z => {
                                        mails.push(z.mail)
                                    })
                                    let body = {
                                        emails: mails,
                                        startTime: new Date(props.stDate + " 09:00:00"),
                                        endTime: new Date(props.enDate + " 18:00:00"),
                                        meetingTime: meetingTijd,
                                        tijdWeg: reistijd
                                    }
                                    console.log(body)
                                fetch(props.api + "/ICS/GetAvailability?bearerToken=" + props.bearer.accessToken, {
                                    method: "POST",
                                    body: JSON.stringify(body),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                    
                                })

                                .then(res => {
                                    if(res.ok){
                                        return res.json().then((result) => {
                                            setList(result.value)
                                            props.setBearer(result.bearer)
                                            checkDate(result.value)
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
                                else{

                                    alert("Vul het veld Reistijd in!")
                                }
                                
                            }
                            else{
                                alert("Vul het Duur meeting veld in!")
                            }
                        
                    
                
            }
            else{
                alert("Vul het locatieveld in!")
            }
        
        
    }


    return (
        <div style={{color: "black"}}>
        <div className="row">
            <div className="col">
                <h3>{props.can}: {props.sel.Text}</h3>
            </div>
            <div className="col-sm-1 text-end" style={{color:"black"}}>
                                <div className="ps-5"> <h2 onClick={() => props.setPlanner(false)} style={{cursor: "pointer"}}>x</h2></div>
                            </div>
        </div>
        {start ? <>
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
        </> : <div >
        
        <div className="row">
                                
                                    <div className="col-sm-3">
                                        <h5 className="text-start" >Locatie</h5> 
                                    </div>
                                    <div className="col-sm-4 text-start text-top">
                                        
                                    
                                                <h6>Online meeting</h6>
                                                <input type="checkbox" defaultChecked={online} onChange={(y) => {
                                                    setOnline(y.target.checked)
                                                    setReisTijdB(false)
                                                    setReisTijd("00:00")
                                                }}></input>
                                            
                                            
                                        
                                        
                                        
                                    </div>
                                    {online ? <>
                            
                            </> : <>
                                <div className="col">
                                    <h6 >Reistijd meerekenen</h6>
                                    <input type="checkbox" defaultChecked={reistijdB} onChange={(y) => setReisTijdB(y.target.checked)}></input>
                                </div>
                                
                            
                            
                            </>}
                            

                                </div>
                                <div className="row">
                                
                                {online ? <></>
                                        : <>
                                    <input type="text" className="text-start d-inline-flex p-2 form-control" placeholder={"Vul hier de locatie van de workshop in"} defaultValue={locatie} onChange={(z) => setLocatie(z.target.value)}></input>
                                    </>}
                                
                            </div>
        <div className="row m-2">
                            <div className="col text-start">
                                <h5 className="text-start" >Duur meeting</h5>
                                <input type="time" defaultValue={meetingTijd} onChange={(y) => {
                                    setMeetingTijd(y.target.value)
                                }}></input>
                            </div>
                            {reistijdB && !online ? <>
                            <div className="col text-start">
                                <h5 className="text-start" >Reistijd ITC medewerkers</h5>
                                <input type="time" defaultValue={"00:00"} onChange={(y) => {
                                    props.setReisTijd(y.target.value);
                                }}></input>
                            </div>
                        </> : <></>}
                        </div>
        <button className="btn btn-primary" onClick={fetchAva}>Check tijd</button>


        </div>}
        
        </div>
    )

}
export default CanvasPlan