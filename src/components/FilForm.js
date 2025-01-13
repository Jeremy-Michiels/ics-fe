import { useRef } from "react"
import {readFile, utils} from "xlsx"
import { Link } from "react-router";


import Template from "../ExcelTemplate.xlsx"

function FilForm(props) {


    let titelInput=useRef();
    let locatieInput=useRef();
    let stDateInput=useRef();
    let enDateInput=useRef();
    let mailBerichtInput=useRef();
    let modalRef = useRef();
    let meetingTijdRef = useRef();
    

    const fileToDataUri = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result)
        };
        reader.readAsArrayBuffer(file);
        })
        
        function selecter(sel){
            props.setExcelSelected(sel)
            titelInput.current.value = "Workshop " + sel["Workshop Nummer"] + ": " + sel["Workshop Naam"]
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
            meetingTijdRef.current.value = uur + ":" + min
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
            props.setExcelList(true)
            modalRef.current.style.display = "none";
        }



        const onChange = (file) => {
    
            if(!file) {
              return;
            }
        
            fileToDataUri(file)
              .then(dataUri => {

                
                const workbook = readFile(dataUri)
                const sheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = utils.sheet_to_json(sheet)
                props.setList(jsonData);
                props.newerListSetter(jsonData)
                
                // Get the modal
                var modal = modalRef.current
                modal.style.display = "block";

                // When the user clicks anywhere outside of the modal, close it
                window.onclick = function(event) {
                if (event.target === modal) {
                    modal.style.display = "none";

                }
                }
              })
            
          }
        
    

    return(
        <>
        <div className="modal" ref={modalRef}>
        <div className="modal-content" style={{color: "black"}}>
            {props.list.length > 0 ? <>
            <p>Kies een opdracht</p>
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
        {props.newerList.map(y => {
            return <div key={y["Workshop Nummer"]}>
            <div className="row m-2 p-1 border border-black border-solid" >
                <div className="col">
                    {y["Workshop Nummer"]}
                </div>
                <div className="col">
                    {y["Workshop Naam"]}
                </div>
                <div className="col">
                    <button className="btn btn-primary" onClick={() => selecter(y)}>
                        Selecteer
                    </button>
                </div>

            </div>
            </div>
        })}
            </> : <></>}
        </div>
        </div>
            <div className="container">
                <div className="row">
                <h1 className="text-start mb-5">Meeting Gegevens</h1>
                    <div className="col-sm-5 me-5" style={{position: "relative"}}>

                        <div className="row p-1">
                            <div className="col">
                                <h5 className="text-start">Titel</h5>
                                <input type="text" className="text-start d-inline-flex p-2 form-control" placeholder={"Vul hier de titel van de workshop in"} defaultValue={props.titel} ref={titelInput} disabled={props.excelSelected["Workshop Naam"] !== undefined}></input>
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
                                <input type="date" className="text-start d-inline-flex p-2 form-control" defaultValue={props.stDate} ref={stDateInput} onChange={(y) => props.setStDate(y)}></input>
                            </div>
                            <div className="col">
                                <h5 className="text-start">Eind datum</h5>
                                <input type="date" className="text-start d-inline-flex p-2 form-control" defaultValue={props.enDate} ref={enDateInput} onChange={(y) => props.setEnDate(y)}></input>
                            </div>
                        </div>
                        <div className="row m-2">
                            <div className="col text-start">
                                <h5 className="text-start">Duur meeting</h5>
                                <input type="time" defaultValue={props.meetingTijd} ref={meetingTijdRef} onChange={(y) => {
                                    props.setMeetingTijd(y.target.value)
                                }} disabled={props.excelSelected["Tijdsindicatie"] !== undefined}></input>
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
                        
                        
                        

                    </div>
                    <div className="col" >
                        <h5>Mailbericht</h5>
                        <textarea type="textarea" className="form-control" rows={20} defaultValue={props.mailBericht} ref={mailBerichtInput}>
                        </textarea>
                    </div>
                    
                </div>
                <div className="row" >
                            <div className="col-sm-5 me-5">
                                <div className="row">
                                <div className="col">
                            <button className="btn btn-primary" onClick={() => {
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
                                                        if((props.reistijdB === false || (props.reistijdB === true && !props.online && props.reistijd !== "00:00") || props.online)){
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
                            {props.excelList === false ? <>
                                <div className="col">
                            <label htmlFor="file-upload" className="custom-file-upload btn btn-primary">
                                Upload een Excel bestand
                            </label>
                            <input id="file-upload" type="file" onChange={(event) => onChange(event.target.files[0] || null)}/>
                            </div>
                            <div className="col">
                                <Link to={Template} target="_blank" download>
                                
                                <button className="btn btn-success">
                                    Download de Excel template voor Workshops
                                </button>
                                </Link>
                            </div>
                            </> : <></>}
                                </div>
                            </div>
                            <div className="col">

                            </div>
                            
                            
                            
                        </div>
                
            </div>
        </>
    )
}

export default FilForm