import { useRef } from "react"

function FilForm(props) {

    let titelInput=useRef();
    let locatieInput=useRef();
    let stDateInput=useRef();
    let enDateInput=useRef();
    let mailBerichtInput=useRef();

    console.log(props.check)
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
                                <h5 className="text-start">Locatie</h5>
                                <input type="text" className="text-start d-inline-flex p-2 form-control" placeholder={"Vul hier de locatie van de workshop in"} defaultValue={props.locatie} ref={locatieInput}></input>
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
                        <div className="row" style={{position: "absolute", bottom: 0}}>
                            <button className="btn btn-primary" onClick={() => {
                                
                                props.setTitel(titelInput.current.value);
                                props.setLocatie(locatieInput.current.value);
                                props.setStDate(stDateInput.current.value);
                                props.setEnDate(enDateInput.current.value);
                                props.setMailBericht(mailBerichtInput.current.value);
                                props.setCheck(false);
                                }}>
                                Ga verder
                            </button>
                        </div>

                    </div>
                    <div className="col" >
                        <h5>Mailbericht</h5>
                        <textarea type="textarea" className="form-control" rows={20} ref={mailBerichtInput}>
                        </textarea>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FilForm