//---------------- require modules -------------------

const express = require("express"); //npm install express
const https = require("https");
const bodyParser = require("body-parser");//npm install body-parser
//current version of node-fetch is 3.0.0 which is unstable, so to install prev version i.e 2.0 ; we nned to specify @version
const fetch = require('node-fetch');//npm install node-fetch@2.0

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

let title= "Covid-19 Tracker";

let desh = "India"; //default country
let FlagIcon;
let Continent;
let Population;
let TotalCase;
let TotalDeath;
let TotalRecovered;
let DeathPercent;
let RecoveryPercent;
let TotalActiveCase;
let TotalCriticalCase;

let desh1 = "USA"; //default country
let FlagIcon1;
let Continent1;
let Population1;
let TotalCase1;
let TotalDeath1;
let TotalRecovered1;
let DeathPercent1;
let RecoveryPercent1;
let TotalActiveCase1;
let TotalCriticalCase1;

let desh2 = "India"; //default country
let FlagIcon2;
let Continent2;
let Population2;
let TotalCase2;
let TotalDeath2;
let TotalRecovered2;
let DeathPercent2;
let RecoveryPercent2;
let TotalActiveCase2;
let TotalCriticalCase2;

app.get("/", function (req, res) {
    console.log("Recieved get request");
    title= "Covid-19 Tracker";

    /*
    //----------------------------- USING ASYNC AWAIT PROMISE (fast) ---------------------------

    const getData= async (desh) =>{    
        console.log("getData");
        let apiLink= "https://disease.sh/v3/covid-19/countries/"+desh+"?strict=false";
    
        const Resp =await fetch(apiLink);
        const Data = await Resp.json();
    
        return Data;
    };


    getData(desh)
        .then(Data => { 
            console.log("final data recieved");
        }).catch(err =>{
            console.log(err);
        });


    const updateDesh= async(desh) =>{  
        console.log("updateDesh");
        let finalData = await getData(desh);
        return finalData;
    };


    const updateUI= (defaultCovidData)=>{    // This will actually use the data & reflect it to .ejs file which user can see (UI)
        console.log("updateUI");
        FlagIcon = defaultCovidData.countryInfo.flag;
        Continent = defaultCovidData.continent;
        Population = defaultCovidData.population;
        TotalCase = defaultCovidData.cases;
        TotalDeath = defaultCovidData.deaths;
        TotalRecovered = defaultCovidData.recovered;
        DeathPercent = (TotalDeath / TotalCase) * 100;
        RecoveryPercent = (TotalRecovered / TotalCase) * 100;
        TotalActiveCase = defaultCovidData.active;
        TotalCriticalCase = defaultCovidData.critical;
        
        
        // rendering with ejs module
        res.render("covid", {
            hour: hour,
            min: min,
            dayDescription: dayDescription,
            desh: desh,
            FlagIcon: FlagIcon,
            Continent: Continent,
            Population: Population,
            TotalCase: TotalCase,
            TotalDeath: TotalDeath,
            TotalRecovered: TotalRecovered,
            DeathPercent: DeathPercent,
            RecoveryPercent: RecoveryPercent,
            TotalActiveCase: TotalActiveCase,
            TotalCriticalCase: TotalCriticalCase
        });
    };


    updateDesh(desh)     // calling updateCity promise
    .then(data =>updateUI(data))   // if data found, call updateUIwith that data
    .catch(err =>console.log(err));

    */
    
    let apiLink = "https://disease.sh/v3/covid-19/countries/"+desh+"?strict=false";

    https.get(apiLink, function (response) {
        /*
        https response data are colleceted in small chunk, 
        so when its collecting data ("on"), we should append the data(string) in variable (starting with empty string [here let chunks="";])
        when all the chunk of data is collected ("end"), then we should finally parse the string(API data) into JSON format. */
        
        let chunks="";
        response.on("data", function (chunk) {
            chunks+=chunk;
        });
        response.on("end", function(){
            // console.log("API Data recieved");

            let defaultCovidData = JSON.parse(chunks);
            
            if(response.statusCode==404){
                res.redirect("/errorPage");
            }
            else if(response.statusCode==200){

                desh= defaultCovidData.country;
                FlagIcon = defaultCovidData.countryInfo.flag;
                Continent = defaultCovidData.continent;
                Population = defaultCovidData.population;
                TotalCase = defaultCovidData.cases;
                TotalDeath = defaultCovidData.deaths;
                TotalRecovered = defaultCovidData.recovered;

                //We take the number and add a very small number, Number.EPSILON, to ensure the number’s accurate rounding. 
                //We then multiply by number with 100 before rounding to extract only the two digits after the decimal place. 
                //Finally, we divide the number by 100 to get a max of 2 decimal places.

                DeathPercent = (TotalDeath / TotalCase) * 100; 
                DeathPercent= Math.round((DeathPercent + Number.EPSILON) * 1000) / 1000;   // round up to 3 decimal places

                RecoveryPercent = (TotalRecovered / TotalCase) * 100;
                RecoveryPercent= Math.round((RecoveryPercent + Number.EPSILON) * 100) / 100;
                TotalActiveCase = defaultCovidData.active;
                TotalCriticalCase = defaultCovidData.critical;

                //console.log("Rendering Data");
                res.render("covid", {
                    title: title,
                    desh: desh,
                    FlagIcon: FlagIcon,
                    Continent: Continent,
                    Population: Population,
                    TotalCase: TotalCase,
                    TotalDeath: TotalDeath,
                    TotalRecovered: TotalRecovered,
                    DeathPercent: DeathPercent,
                    RecoveryPercent: RecoveryPercent,
                    TotalActiveCase: TotalActiveCase,
                    TotalCriticalCase: TotalCriticalCase
                });
            }
        });
    });

});

app.post("/", function (req, res) {
    desh = req.body.newDesh;
    if(desh===""){
        res.redirect("/errorPage");
    }
    else{
        console.log("Post request recieved for: " + desh);
        res.redirect("/");
    }
});


app.get("/compare", function(req, res){
    title= "Compare Data";
    //----------------------------- USING ASYNC AWAIT PROMISE (fast) ---------------------------

    const getData= async (desh1,desh2) =>{    
        console.log("getData");
        let apiLink1= "https://disease.sh/v3/covid-19/countries/"+desh1+"?strict=false";
        let apiLink2= "https://disease.sh/v3/covid-19/countries/"+desh2+"?strict=false";

        const Resp1 =await fetch(apiLink1);
        const Resp2 =await fetch(apiLink2);
        const Data1 = await Resp1.json();
        const Data2 = await Resp2.json();

        let Data={
            Data1: Data1,
            Data2: Data2
        }
    
        return Data;
    };


    getData(desh1,desh2)
        .then(Data => { 
            console.log("final data recieved");
        }).catch(err =>{
            res.redirect("/errorPage");
        });


    const updateDesh= async(desh1,desh2) =>{  
        console.log("updateDesh");
        let finalData = await getData(desh1,desh2);
        return finalData;
    };


    const updateUI= (defaultCovidData)=>{    // This will actually use the data & reflect it to .ejs file which user can see (UI)
        console.log("inside update UI");

        let defaultCovidData1= defaultCovidData.Data1;
        let defaultCovidData2= defaultCovidData.Data2;
        console.log("data for "+desh1+" has been recieved");
        console.log("desh1: "+defaultCovidData1.message+" desh2:"+defaultCovidData2.message);

        if((defaultCovidData1.message==="Country not found or doesn't have any cases") || (defaultCovidData2.message==="Country not found or doesn't have any cases")){
            res.redirect("/errorPage");
        }
        else{
            
            desh1= defaultCovidData1.country;
            FlagIcon1 = defaultCovidData1.countryInfo.flag;
            Continent1 = defaultCovidData1.continent;
            Population1 = defaultCovidData1.population;
            TotalCase1 = defaultCovidData1.cases;
            TotalDeath1 = defaultCovidData1.deaths;
            TotalRecovered1 = defaultCovidData1.recovered;
            DeathPercent1 = (TotalDeath1 / TotalCase1) * 100;
            DeathPercent1= Math.round((DeathPercent1 + Number.EPSILON) * 1000) / 1000;
            RecoveryPercent1 = (TotalRecovered1 / TotalCase1) * 100;
            RecoveryPercent1= Math.round((RecoveryPercent1 + Number.EPSILON) * 100) / 100;
            TotalActiveCase1 = defaultCovidData1.active;
            TotalCriticalCase1 = defaultCovidData1.critical;

            console.log("data for "+desh2+" has been recieved");

            desh2= defaultCovidData2.country;
            FlagIcon2 = defaultCovidData2.countryInfo.flag;
            Continent2 = defaultCovidData2.continent;
            Population2 = defaultCovidData2.population;
            TotalCase2 = defaultCovidData2.cases;
            TotalDeath2 = defaultCovidData2.deaths;
            TotalRecovered2 = defaultCovidData2.recovered;
            DeathPercent2 = (TotalDeath2 / TotalCase2) * 100;
            DeathPercent2= Math.round((DeathPercent2 + Number.EPSILON) * 1000) / 1000;
            RecoveryPercent2 = (TotalRecovered2 / TotalCase2) * 100;
            RecoveryPercent2= Math.round((RecoveryPercent2 + Number.EPSILON) * 100) / 100;
            TotalActiveCase2 = defaultCovidData2.active;
            TotalCriticalCase2 = defaultCovidData2.critical;
            
            
            // rendering with ejs module
            res.render("compare", {
                title: title,
        
                desh1: desh1,
                FlagIcon1: FlagIcon1,
                Continent1: Continent1,
                Population1: Population1,
                TotalCase1: TotalCase1,
                TotalDeath1: TotalDeath1,
                TotalRecovered1: TotalRecovered1,
                DeathPercent1: DeathPercent1,
                RecoveryPercent1: RecoveryPercent1,
                TotalActiveCase1: TotalActiveCase1,
                TotalCriticalCase1: TotalCriticalCase1,
        
                desh2: desh2,
                FlagIcon2: FlagIcon2,
                Continent2: Continent2,
                Population2: Population2,
                TotalCase2: TotalCase2,
                TotalDeath2: TotalDeath2,
                TotalRecovered2: TotalRecovered2,
                DeathPercent2: DeathPercent2,
                RecoveryPercent2: RecoveryPercent2,
                TotalActiveCase2: TotalActiveCase2,
                TotalCriticalCase2: TotalCriticalCase2
            });
        }
    };

    updateDesh(desh1,desh2)     // calling updateCity promise
    .then(data =>updateUI(data))   // if data found, call updateUIwith that data
    .catch(err =>console.log(err));

});

app.post("/compare", function(req, res){
    desh1 = req.body.newDesh1;
    desh2= req.body.newDesh2;
    if(desh1==="" && desh2===""){
        res.redirect("/errorPage");
    }
    else{
        console.log("Post request recieved for: " + desh1+" & "+desh2);
        res.redirect("/compare");
    }
});

app.get("/errorPage", function(req, res){
    console.log("Insides errorPage get");
    res.render("errorPage");
});

app.post("/errorPage", function(req, res){
    desh="India";
    desh1="USA";
    desh2="India";
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server has been created at port 3000");
});


// All country API: "https://disease.sh/v3/covid-19/countries"