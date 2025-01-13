import { useState } from "react"

function Canvas(){

    //Kick-off datum
    let [kickOffDate, setKickOffDate] = useState();
    let [canvasDays, setCanvasDays] = useState([{
        id: 1, Text: "Inventory", Days: 0, Work: {
            Name: "Inventory",
            Meeting: false,
        }
    }, {
        //Hoeveel dagen moet Concept Canvas Definition voor de training af zijn?
        id: 2, Text: "Concept Definition", Days: 1, Work: {
            Name: "Concept Definition",
            Meeting: false,
        }
    }, {
        id: 3, Text: "Training", Days: 1, Work: {
            Name: "Training course",
            Meeting: true,
        }
    }, {
        //Hoeveel dagen na de training moet de definition workshop zijn?
        id: 4, Text: "Definition Workshop", Days: 1, Work: {
            Name: "Definition Workshop",
            Meeting: true,
        }
    }, {
        //Hoeveel dagen na de definition workshop moet de canvas definition af zijn?
        id: 5, Text: "Definition", Days: 4, Work: {
            Name: "Definition",
            Meeting: false,
        }
    }, {
        //Hoeveel dagen na de canvas definition moet de canvas revision gedaan zijn?
        id: 6, Text: "Revision", Days: 3, Work: {
            Name: "Revision",
            Meeting: false,
        }
    }, {
        //Hoeveel dagen na de canvas revision moet de canvas validation workshop gedaan zijn?
        id: 7, Text: "Validation Workshop", Days: 5, Work: {
            Name: "Validation Workshop",
            Meeting: true,
        }

    }])
    
    //Hoeveel dagen zitten er tussen het opstarten van een nieuwe canvas cyclus?
    let [cyclOpCanvas, setCyclOpCanvas] = useState(15);
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
        "Enterprise",
        "Proces",
        "Application",
        "Information",
        "Technology"
    ])
    let day = 0
    function dayT(y, list){
        let i = 0;
        var nList = list.filter(x => x.id <= y.id)
        nList.forEach(x => {
            i = i + x.Days
        })


        return i + 1;
    }
    


    return (
        <>
        <div className="container">
            <div className="row p-3 bg-white rounded text-black">
                <div className="row">
                    <div className="col">
                        Welk cyclusonderdeel?
                    </div>
                    <div className="col">
                        Welke dag van de cyclus?
                    </div>
                    <div className="col">
                        Dagen tussen 2 onderdelen
                    </div>
                </div>{
                    
                canvasDays.map(y => {
                    return (
                        <div className="row border border-dark" key={y.id}>
                            <div className="col">
                                {y.Text}
                            </div>
                            <div className="col">
                                {dayT(y, canvasDays)}
                            </div>
                            <div className="col">
                                {y.Days}
                            </div>
                        </div>
                    )
                    
                })
            }
                {/* 
                <div className="row">
                    <div className="col">
                        <p>Dagen Definition workshop na training</p>
                    </div>
                    <div className="col">
                        {defWorkshopAfTraining} {defWorkshopAfTraining  === 1 ? "dag" : "dagen"}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p>Canvas Definition vanaf definition Workshop</p>
                    </div>
                    <div className="col">
                        {canDefAfWorkshop} {canDefAfWorkshop  === 1 ? "dag" : "dagen"}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p>Canvas Revision vanaf Definition</p>
                    </div>
                    <div className="col">
                        {canRevAfDefinition} {canRevAfDefinition  === 1 ? "dag" : "dagen"}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <p>Canvas validation Workshop vanaf Revision</p>
                    </div>
                    <div className="col">
                        {canValWorkAfRev} {canValWorkAfRev  === 1 ? "dag" : "dagen"}
                    </div>
                </div> */}
                
                
            </div>
        </div>
        </>
    )
}
export default Canvas