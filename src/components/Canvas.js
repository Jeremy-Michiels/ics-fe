import { useRef, useState } from "react"
import CanvasPlan from "./CanvasPlan";

function Canvas(props){

    let canRef = useRef();

    let invRef = useRef();
    let conDefRef = useRef();
    let trainingRef = useRef();
    let defiWSRef = useRef();
    let defRef = useRef();
    let revRef = useRef();
    let valWsRef = useRef();
    let modalRef = useRef();

    let [canDate, setCanDate] = useState("")

    let [mails, setMails] = useState([{
        mail: props.user,
        ITC: true
    }])
    let [sel, setSel] = useState({})

    //Bedrijfsnaam
    let [bedrijfNaam, setBedrijfNaam] = useState("")
    let [bedrijfBool, setBedrijfBool] = useState(false)

    //Kick-off datum
    let [kickOffDate, setKickOffDate] = useState(new Date());
    let [canvasDays, setCanvasDays] = useState([{
        id: 1, Text: "Inventory", Days: 0, change:false, Work: {
            Name: "Inventory",
            Meeting: false,
        }
    }, {
        //Hoeveel dagen moet Concept Canvas Definition voor de training af zijn?
        id: 2, Text: "Concept Definition", Days: 1,change:false, Work: {
            Name: "ConDef",
            Meeting: false,
        }
    }, {
        id: 3, Text: "Training", Days: 1,change:false, Work: {
            Name: "Training",
            Meeting: true,
        }
    }, {
        //Hoeveel dagen na de training moet de definition workshop zijn?
        id: 4, Text: "Definition Workshop", Days: 1,change:false, Work: {
            Name: "DefWS",
            Meeting: true,
        }
    }, {
        //Hoeveel dagen na de definition workshop moet de canvas definition af zijn?
        id: 5, Text: "Definition", Days: 4,change:false, Work: {
            Name: "Def",
            Meeting: false,
        }
    }, {
        //Hoeveel dagen na de canvas definition moet de canvas revision gedaan zijn?
        id: 6, Text: "Revision", Days: 3,change:false, Work: {
            Name: "Rev",
            Meeting: false,
        }
    }, {
        //Hoeveel dagen na de canvas revision moet de canvas validation workshop gedaan zijn?
        id: 7, Text: "Validation Workshop", Days: 5,change:false, Work: {
            Name: "ValWs",
            Meeting: true,
        }

    }])
    
    //Hoeveel dagen zitten er tussen het opstarten van een nieuwe canvas cyclus?
    let [cyclOpCanvas, setCyclOpCanvas] = useState(15);
    let [canBool, setCanBool] = useState(false)
    //Hoeveel dagen zitten er tussen het opstarten van een nieuwe Landschappen cyclus
    let [cyclOpLands, setCyclOpLands] = useState(20)

    //Hoeveel dagen na de landschaptraining moet de landschap definition workshop af zijn gerond?
    let [landDefWsAfTraining, setLandDefWsAfTraining] = useState(1)
    //Hoeveel dagen na de workshop moet de landschap definition af zijn?
    let [landDefAfWorkshop, setLandDefAfWorkshop] = useState(5)
    //Hoeveel dagen na de definition moet de landschap revision af zijn?
    let [landRevAfDef, setLandRevAfDev] = useState(5)
    //Hoeveel dagen na de revision moet de landschap validation workshop gedaan zijn?
    let [landValWsAfRev, setLandValWsAfRev] = useState(5)

    let [canvassen, setCanvassen] = useState([
        {id: 1, can: "Enterprise"},
        {id: 2, can: "Proces"},
        {id: 3, can: "Application"},
        {id: 4, can: "Information"},
        {id: 5, can: "Technology"}
    ])

    let [planBool, setPlanBool] = useState(false)
    let [curCanvas, setCurCanvas] = useState(0);
    let [curCanObject, setCurCanObject] = useState({})

    let [canvasList, setCanvasList] = useState([{}])
    let [planner, setPlanner] = useState(false)

    function dayT(y){
        let i = 0;
        var nList = canvasDays.filter(x => x.id <= y.id)
        nList.forEach(x => {
            i = i + x.Days
        })


        return i + 1;
    }
    function setChange(y){
        if(planBool === false){
            var l = canvasDays.map(x => {
                if(x.id === y.id){
                    return {...x, change: !y.change}
                }
                else{
                    return x
                }
            })
            setCanvasDays(l);
        }
        
    }
    function sender(y, z){
        var l = canvasDays.map(x => {
            if(x.id === y.id){
                return {...x, Days: z === "" ? 0 : Number.parseInt(z)}
            }
            else{
                return x
            }
        })
        setCanvasDays(l);
    }

    function plan(){
        if(!planBool){
        if(kickOffDate === ""){
            alert("Voer een datum in voor de 1e training")
        }
        else{
            if(!bedrijfBool){
                alert("Voer een bedrijfsnaam in")
            }
            else{
                if(kickOffDate.getDay() === 0 || kickOffDate.getDay() === 6){
                    alert("Startdatum mag geen weekenddag zijn")
                }
                else{
                    setPlanBool(true)
                    setCurCanvas(x => x + 1)
                    var i = {}
                    canvassen.forEach((z => {
                        if(z.id === curCanvas + 1){
                            i = z
                        }
                    }))
                    let stDate = new Date(kickOffDate);
                    var negative = - canvasDays[2].Days - canvasDays[1].Days
                    var positive = (canvasDays[3].Days + canvasDays[4].Days + canvasDays[5].Days + canvasDays[6].Days + 5)
                    stDate.setDate(stDate.getDate() + (Math.round((((negative - 5) / 5 - ((negative - 5) % 5)/5) * 2)) + negative))
                    let enDate = new Date(kickOffDate);
                    enDate.setDate(enDate.getDate()  +  positive  + ((positive / 5 - (positive % 5)/5) * 2
                ))
                    var dates = getWorkingDays(stDate, enDate)
                    dates = dates.map(x => {return x.toDateString()})
                    console.log(dates)
                    var trainingIndex = dates.findIndex(e => e === kickOffDate.toDateString())
                    
                    i.Inventory = dates[trainingIndex - canvasDays[1].Days - canvasDays[2].Days]
                    i.ConDef = dates[trainingIndex - canvasDays[2].Days]
                    i.Training = dates[trainingIndex]
                    i.DefWS = dates[trainingIndex + canvasDays[3].Days]
                    i.Def = dates[trainingIndex + canvasDays[3].Days + canvasDays[4].Days]
                    i.Rev = dates[trainingIndex + canvasDays[3].Days + canvasDays[4].Days + canvasDays[5].Days]
                    i.ValWs = dates[trainingIndex + canvasDays[3].Days + canvasDays[4].Days + canvasDays[5].Days + canvasDays[6].Days]



                    setCurCanObject(i)

                    }
                
            }
        }
    }
        

    }


    function getWorkingDays(startDate, endDate){
        var result = [];
   
       var currentDate = startDate;
       while (currentDate <= endDate)  {  
   
           var weekDay = currentDate.getDay();
           if(weekDay !== 0 && weekDay !== 6)
               result.push(new Date(currentDate));
   
            currentDate.setDate(currentDate.getDate()+1); 
       }
   
       return result;
    }
    


    return (
        <>
        <div className="container">
            <div className="row mb-2">
                <div className="col">
                    <h3>Canvasplanning voor:</h3>
                </div>
                
                    {bedrijfBool ? <>
                    <div className="col" onDoubleClick={() => setBedrijfBool(false)}>
                        {bedrijfNaam}
                    </div>
                    <div className="col"></div>
                    </> : <>
                        <div className="col">
                    <input  type="text" className="form-control" defaultValue={bedrijfNaam} placeholder="Naam Bedrijf" onChange={(z) => setBedrijfNaam(z.target.value)}></input>
                    </div>
                    <div className="col">
                        <button className="btn btn-primary" onClick={() => {
                            if(bedrijfNaam !== ""){
                                setBedrijfBool(true)
                            }
                            else{
                                alert("Voer een bedrijfsnaam in")
                            }
                        }}>Bedrijfsnaam vastzetten</button>
                    </div>
                    </>}
                    
                
            </div>
            {bedrijfBool ? <><div className="row mb-2">
                <div className="col">
                    <button className="btn btn-danger">
                        IT-Councelor medewerker toevoegen
                    </button>
                </div>
                <div className="col">
                    <button className="btn btn-primary">
                        {bedrijfNaam} medewerker toevoegen
                    </button>
                </div>
            </div></> : <></>}
            
            <div className="row p-3 bg-white rounded text-black">
                <div className="row">
                    <div className="col">
                        <h4>Welk cyclusonderdeel? </h4>
                    </div>
                    <div className="col">
                        <h4>Welke dag van de cyclus?</h4>
                    </div>
                    <div className="col">
                        <h4>Dagen tussen 2 onderdelen</h4>
                    </div>
                </div>{
                    
                canvasDays.map(y => {
                    return (
                        <div className="row border border-dark" key={y.id} >
                            <div className="col">
                                <h5>{y.Text}</h5>
                            </div>
                            <div className="col" >
                                <h5>{dayT(y)}</h5>
                            </div>
                            <div className="col">
                                {y.change ? <>
                                <div className="row">
                                    <div className="col">
                                <input type="number" className="form-control" defaultValue={y.Days} onChange={(x) => sender(y, x.target.value)}></input>
                                </div>
                                <div className="col">
                                    <button className="btn btn-primary" onClick={() => setChange(y)}>
                                        Versturen
                                    </button>
                                </div>
                                </div>
                                </>
                                 : <h5 onDoubleClick={() => setChange(y)}>{y.Days}</h5>}
                            </div>
                        </div>
                    )
                    
                })
            }
            
                <div className="row mt-3">
                    <div className="col"><h3>Dagen tussen 2 trainingen</h3></div>
                    <div className="col">{canBool ? <>
                    <div className="row">
                        <div className="col">
                            <input type="number" className="form-control"  onChange={(z) => setCyclOpCanvas(Number.parseInt(z.target.value))} defaultValue={cyclOpCanvas}>
                            </input>
                        </div>
                        <div className="col">
                            <button className="btn btn-primary" onClick={() => setCanBool(false)}>Versturen</button>
                        </div>
                    </div>
                    </> : 
                    <h4 onDoubleClick={() => {
                        if(!planBool){
                            setCanBool(true)
                        }
                    }}>{cyclOpCanvas}</h4>
                    }</div>
                    
                </div>
                


                <div className="row mt-3 p-1 bg-dark"></div>
                <div className="row mt-4">
                    <div className="col">Datum training 1</div>
                    {planBool ? <>
                    <div className="col">
                    {new Date(kickOffDate).toLocaleDateString()}
                    </div>
                    </> : <>
                        <div className="col"><input type="date"className="form-control" defaultValue={kickOffDate} onChange={(y) => setKickOffDate(new Date(y.target.value))}></input></div>
                        <div className="col"><button className="btn btn-primary" onClick={plan}>Versturen</button></div>
                        </>}
                    
                </div>
            </div>
            <div className="row m-2" ref={canRef}>
            {planBool ? <>
                <div className="col p-3 rounded bg-danger">
                    {curCanObject !== undefined ? curCanObject.can : <></>}
                    <div className="row p-1 bg-dark"></div>
                    
                        {canvasDays.map(v => {
                            return <>
                            <div className="row p-1" key={v.id}>
                                <div className="col">
                                    {v.Text}
                                </div>
                                <div className="col">
                                    
                                    {new Date(curCanObject[v.Work.Name]).toLocaleDateString()}
                                </div>
                                <div className="col">
                                    {v.Work.Meeting ? <button className="btn btn-primary" onClick={() => {

                                        setCanDate(curCanObject[v.Work.Name])
                                        setPlanner(true)
                                        setSel(v)
                                    }
                                    }>Check planning</button> : <></>}
                                </div>
                            </div>
                            <div className="row p-1 bg-secondary"></div>
                            </>
                        })}
                    
                </div>
            </> : <></>}
            </div>
        </div>
        {planner ? <>
            <div className="modal" style={{display: "block"}}>
                <div className="modal-content">
            <CanvasPlan
            api={props.api}
            stDate={canDate}
            enDate={canDate}
            emails={mails}
            bearer={props.bearer} setBearer={props.setBearer}
            planner={planner} setPlanner={setPlanner}
            sel={sel}
            can={curCanObject.can}
            ></CanvasPlan>
            </div>
        </div>
        </> : <></>}
        
        </>
    )
}
export default Canvas