import { useRef, useState } from "react"

function FilForm(props) {

    let titelInput=useRef();
    let locatieInput=useRef();
    let stDateInput=useRef();
    let enDateInput=useRef();
    let mailBerichtInput=useRef();
    let onlineBox = useRef();

    


    return(
        <>
            <div className="container">
                <div className="row">
                <h1 className="text-start mb-5">Meeting Gegevens</h1>
                    <div className="col-sm-4 me-5" style={{position: "relative"}}>

                        <div className="row p-1">
                            <div className="col">
                                <h5 className="text-start">Titel</h5>
                                <input type="text" className="text-start d-inline-flex p-2 form-control" placeholder={"Vul hier de titel van de workshop in"} defaultValue={props.titel} ref={titelInput}></input>
                            </div>
                        </div>
                        <div className="row p-1">
                            <div className="col">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <h5 className="text-start">Locatie</h5> 
                                    </div>
                                    <div className="col-sm-4 text-start text-top">
                                        <div className="row">
                                            <div className="col-sm-1">
                                            <input type="checkbox" defaultChecked={props.online} onChange={(y) => props.setOnline(y.target.checked)}></input>
                                            
                                            </div>
                                            <div className="col">
                                                <h6>Online meeting</h6>
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                                
                                {props.online ? <></>
                                        : <>
                                    <input type="text" className="text-start d-inline-flex p-2 form-control" placeholder={"Vul hier de locatie van de workshop in"} defaultValue={props.locatie} ref={locatieInput}></input>
                                    </>}
                                
                            </div>
                        </div>
                        <div className="row p-1">
                            <div className="col">
                                <h5 className="text-start">Start datum</h5>
                                <input type="date" className="text-start d-inline-flex p-2 form-control" defaultValue={props.stDate} ref={stDateInput}></input>
                            </div>
                            <div className="col">
                                <h5 className="text-start">Eind datum</h5>
                                <input type="date" className="text-start d-inline-flex p-2 form-control" defaultValue={props.enDate} ref={enDateInput}></input>
                            </div>
                        </div>
                        <div className="row m-2">
                            <div className="col text-start">
                                <h5 className="text-start">Duur meeting</h5>
                                <input type="time" defaultValue={props.meetingTijd} onChange={(y) => {
                                    props.setMeetingTijd(y.target.value)
                                }}></input>
                            </div>
                            {props.reistijdB && !props.online ? <>
                            <div className="col text-start">
                                <h5 className="text-start">Reistijd</h5>
                                <input type="time" defaultValue={"00:00"} onChange={(y) => {
                                    props.setReisTijd(y.target.value);
                                }}></input>
                            </div>
                        </> : <></>}
                        </div>
                        {props.online ? <>
                            
                        </> : <><div className="row m-2 mt-3">
                            <div className="col-sm-1 text-end">
                                <input type="checkbox" defaultChecked={props.reistijdB} onChange={(y) => props.setReisTijdB(y.target.checked)}></input>
                            </div>
                            <div className="col-sm-5 text-start"><h6>Reistijd meerekenen</h6></div>
                        
                        
                        </div></>}
                        
                        <div className="row" style={{position: "absolute", bottom: 0}}>
                            <button className="btn btn-primary" onClick={() => {
                                console.log(titelInput.current.value)
                                if(titelInput.current.value !== ""){
                                    props.setTitel(titelInput.current.value);
                                    if((!props.online && locatieInput.current.value) || props.online){
                                        if(props.online){
                                            props.setLocatie("");
                                            props.setOnline(true);
                                        }
                                        else{
                                            props.setLocatie(locatieInput.current.value);
                                            props.setOnline(false);
                                        }
                                        if(stDateInput.current.value !== ""){
                                            props.setStDate(stDateInput.current.value);
                                            if(enDateInput.current.value !== ""){
                                                props.setEnDate(enDateInput.current.value);
                                                if(mailBerichtInput.current.value !== ""){
                                                    props.setMailBericht(mailBerichtInput.current.value);
                                                    if(props.meetingTijd !== "00:00"){
                                                        if((props.reistijdB === false || (props.reistijdB === true && props.online && props.reistijd !== "00:00") || props.online)){
                                                            props.setCheck(false);
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
                                                    alert("Vul het mailbericht veld in!")
                                                }
                                            }
                                            else{
                                                alert("Vul het einddatum veld in!")
                                            }
                                        }
                                        else{
                                            alert("Vul het startdatum veld in!")
                                        }
                                    }
                                    else{
                                        alert("Vul het locatieveld in!")
                                    }
                                }
                                else{
                                    alert("Vul het titelveld in!")
                                }
                                
                                
                                
                                
                                
                                
                                }}>
                                Ga verder
                            </button>
                        </div>

                    </div>
                    <div className="col" >
                        <h5>Mailbericht</h5>
                        <textarea type="textarea" className="form-control" rows={20} defaultValue={props.mailBericht} ref={mailBerichtInput}>
                        </textarea>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilForm