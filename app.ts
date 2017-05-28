let baseURL: string = "http://services.calendar.events.ubc.ca/cgi-bin/rssCache.pl?mode=list&calPath=%2Fpublic%2FEvents+Calendar%2FCentre+for+Excellence+in+Indigenous+Health&calPath=%2Fpublic%2FEvents+Calendar%2FCancer+Prevention+Centre&calPath=%2Fpublic%2FEvents+Calendar%2FCHEOS&calPath=%2Fpublic%2FEvents+Calendar%2FCentre+for+Clinical+Epidemiology+and+Evaluation&calPath=%2Fpublic%2FEvents+Calendar%2FCentre+for+Health+Services+and+Policy+Research&calPath=%2Fpublic%2FEvents+Calendar%2FHuman+Early+Learning+Partnership&calPath=%2Fpublic%2FEvents+Calendar%2FPopulation+Data+BC&calPath=%2Fpublic%2FEvents+Calendar%2FSPPH+Internal&calPath=%2Fpublic%2FEvents+Calendar%2FSchool+of+Population+and+Public+Health&calPath=%2Fpublic%2FEvents+Calendar%2FTerreWEB&calPath=%2Fpublic%2FEvents+Calendar%2FW+Maurice+Young+Centre+for+Applied+Ethics&";

class Greeter {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;

    constructor(element: HTMLElement) {
        this.element = element;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toTimeString();
    }

    start() {
        this.timerToken = setInterval(() => this.span.innerHTML = new Date().toTimeString(), 500);
    }

    stop() {
        clearTimeout(this.timerToken);
    }


    main(startDate: any, endDate: any): any {
        //start = 2017 - 05 - 28 & end=2017 - 06 - 02
        let newURL: string = baseURL + "start=2017-" + startDate + "&end=2017-" + endDate;
        console.log(newURL);
        return this.calendarFetcher(newURL);
    }

    calendarFetcher(url: string): any {
        var res = new XMLHttpRequest();
        var content;
        var arrayOfRes;
        var singleEvent;
        var finalLink;
        var finalLoc;
        var arrayOfEvents = [];
        var finalHTML = "";
        var coreBody;
        res.overrideMimeType('application/xml');
       

        res.onreadystatechange = function () {
            if (res.readyState == 4 && res.status == 200) {
                var finalRes = res.response;


                finalLoc = document.getElementById('finalLocation');
                coreBody = document.getElementById('coreBody');

                var arrayOfRes = finalRes.split("document.write");

                for (let i = 0; i < arrayOfRes.length; i++) {
                    if (arrayOfRes[i].includes('bwitem')) {
                        singleEvent = arrayOfRes[i];
                        arrayOfEvents.push(arrayOfRes[i]);
                    }
                }


                for (let i = 0; i < arrayOfEvents.length; i++) {

                    // the following code analyses one item
                    var objectsParsed = arrayOfEvents[i].split("</div>");

                    // the following part parses start date
                    var timeAndDate = objectsParsed[1];
                    var newTime = timeAndDate.split("2017");
                    console.log("currentTime: " + newTime[0]);
                    var date = newTime[0];
                    var newDate = date.split('bwdescription');
                    var newNewDate = newDate[1].split(' ');
                    var dateOfMonth = newNewDate[2].replace(',', '');
                    var finalDate = newNewDate[1] + ' ' + dateOfMonth;
                    finalHTML = finalHTML + "&lt;tr&gt;" + "&lt;td&gt;" + finalDate + "&lt;/td&gt;";
                    

                    //the following part deals with time
                    var time = newTime[1];
                    var finalTime = time.split("-");
                    var finalFinalTime = finalTime[0];
                    finalHTML = finalHTML + "&lt;td&gt;" + finalFinalTime + "&lt;/td&gt;";

                    // the following part parses clickable link
                    var titleAndLink = objectsParsed[0];
                    var newLink = titleAndLink.split("<a");
                    finalLink = "<a" + newLink[1];
                    console.log(finalLink);
                    finalHTML = finalHTML + "&lt;td&gt;" + finalLink + "&lt;/td&gt;";

                    //the following part deals with location
                    finalHTML = finalHTML + "&lt;td&gt;" + "See description" + "&lt;/td&gt;" + "&lt;/tr&gt;";
                    
                } // end of for loop
                coreBody.innerHTML = finalHTML;
            }
        }
        res.open("GET", url, true);
        res.send();
    }
}

window.onload = () => {
    var el = document.getElementById('content');
    var greeter = new Greeter(el);
    var clicked = document.getElementById('userRequest');
    clicked.addEventListener("click", validateRequest)
    greeter.start();
};

function validateRequest() {
    var luserInput = <HTMLInputElement>document.getElementById('userInput');
    var processedInput = luserInput.value;
    var dates = processedInput.split(',');
    var startDate = dates[0];
    var endDate = dates[1];
    console.log(startDate);
    console.log(endDate);
    console.log("this should be user input: " + processedInput);
    var newProcess = new Greeter(luserInput);
    var results = newProcess.main(startDate, endDate);
    console.log("the response: " + results);

}

/*    <h3>Date</h3>
    <div id="startDate" style="width:50%"></div>

    <h3>Time</h3>
    <div id="startTime" style="width:50%"></div>

    <h3>Clickable title</h3>
    <div id="result" style="width:50%"></div>

    <h3>Location</h3>
    <div id="result" style="width:50%"></div>*/