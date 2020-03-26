

let coins = [];
let GlobalURL = `https://api.coingecko.com/api/v3/coins/`;
let result = [];
let newResult = [];
let newCoin = [];
let CoinBySearch = [];

if (localStorage.getItem("coins") === null) {
    localStorage.setItem("coins", JSON.stringify(coins));
}

let liveReportCheck = JSON.parse(localStorage.getItem("coins"));

// Make a call to all Coins URL
window.onload = GetCoinsURL = () => {
    let CoinsListURL = `${GlobalURL}markets?vs_currency=usd&per_page=99&page=1`;
    $.ajax(
        {
            type: 'GET',
            datatype: 'json',
            url: CoinsListURL,
            success: function (data) {
                console.log(CoinsListURL);
                result = data;
                printCoinsToHTML(result);
                console.log("data:", data, "Url:", CoinsListURL)
            },
            error: function (error) {
                console.log("error : ", error);
            }
        }
    );

}

// get information for More info button
GetCoinByIdURL = (i) => {

    let newResult = result;
    let id = newResult[i].id;
    let CoinByIdURL = `${GlobalURL + id}`;

    $.ajax(
        {
            type: 'GET',
            datatype: 'json',
            url: CoinByIdURL,
            success: function (data) {
                console.log(CoinByIdURL);
                newResult = data;
                console.log("newResult:", newResult)
                PrintCoinPrice(newResult, i)
                console.log("data:", data, "Url:", CoinByIdURL)
            },
            error: function (error) {
                console.log("error : ", error);
            }
        }
    );
}

// Print all coins to HTML
printCoinsToHTML = (res) => {
    let str = ``;
    let result = res;
    for (let i = 0; i < result.length; i++) {
        str += `<div class="card bg-light" style="width: 18rem;">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-xl-10">
                                        <h5 class="card-title">${result[i].name}</h5>
                                    </div>`
        if (liveReportCheck.some(obj => obj.name === result[i].name)) {
            console.log(`${result[i].name} is exist`);
            str += ` <div class="col-xl-2">
                        <div class="custom-control custom-switch float-right">
                            <input checked="checked" type="checkbox" class="custom-control-input" id="customSwitches${result[i].id}" onclick="AddToLiveReport(${i}, this)">
                            <label class="custom-control-label" for="customSwitches${result[i].id}" ></label>                                                             
                        </div>
                    </div>`;
        }

        else {
            str += ` <div class="col-xl-2">
                        <div class="custom-control custom-switch float-right">
                            <input type="checkbox" class="custom-control-input" id="customSwitches${result[i].id}" onclick="AddToLiveReport(${i}, this)">
                            <label class="custom-control-label" for="customSwitches${result[i].id}" ></label>                                                             
                        </div>
                    </div>`;
        }
        str += `</div>`;
        str += `<p class="card-text">${result[i].symbol}</p>
                    <button class="btn btn-primary" style="font-size:13px;" type="button" data-toggle="collapse" data-target="#collapseExample${i}" aria-expanded="false" onclick="GetCoinByIdURL(${i})">
                        More Info </button>
                    <div class="collapse mt-2" id="collapseExample${i}">
                        <div class="spinner-border mt-5" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                </div> </div> `;
        str += `</div > `;
    }
    document.getElementById("PrintHere").innerHTML = str;
}

// Print a specific coin price by id to HTML with collapse
PrintCoinPrice = (newCoin, i) => {
    newResult = newCoin;
    console.log("newResult:", newResult);
    let str = ``;
    str += ` <a><img src="${newCoin.image.small}"></a>
                <p class="card-text"><u>USD:</u> ${newCoin.market_data.current_price.usd}$</p>
                <p class="card-text"><u>EUR:</u> ${newCoin.market_data.current_price.eur}€</p>
                <p class="card-text"><u>ILS:</u> ${newCoin.market_data.current_price.ils}₪</p> `
    document.getElementById("collapseExample" + i).innerHTML = str;
}

//Get new coin to live reports array
AddToLiveReport = (i, element) => {
    let liveRepNew = localStorage.getItem("coins");
    let liveReportNew = JSON.parse(liveRepNew);
    console.log("liveReportNew:", liveReportNew)
    let CoinNumber = i;
    console.log("here", CoinNumber);
    console.log("liveReportNew:", liveReportNew, "result[i]:", result[CoinNumber])
    if ($(`#customSwitches${result[i].id} `).is(':checked')) {
        console.log("IF")
        result[CoinNumber].toggle = true;
        if (liveReportNew.length < 5) {
            liveReportNew.push(result[CoinNumber]);
            console.log("liveReportNew:", liveReportNew)
            localStorage.coins = JSON.stringify(liveReportNew);
        }
        else {
            element.checked = !element.checked; // here i not allowing the new coin to be checked
            ReplaceCoinWindow(result[CoinNumber], CoinNumber);
        }
    }
    else {
        console.log("ELSE");
        let AfterDelArray;
        console.log("will delete coin:", result[CoinNumber])
        result[CoinNumber].toggle = false;
        if (result[CoinNumber].toggle == false) {
            for (let i = 0; i < 5; i++) {
                AfterDelArray = liveReportNew.filter(obj => obj.id !== result[CoinNumber].id);
            }
            console.log(AfterDelArray)
        }
        console.log("liveReportNew:", liveReportNew)
        localStorage.coins = JSON.stringify(AfterDelArray);
        console.log(JSON.parse(localStorage.coins))
    }
}


// Replace window which alert you for choosing more than 5 coins.
ReplaceCoinWindow = (incomingCoin, CoinNumber) => {
    console.log("Replace Window on");
    // console.log(incomingCoin, i)
    let liveReportDelete = localStorage.getItem("coins");
    let liveReportDeleteStr = JSON.parse(liveReportDelete);
    console.log("liveReportDeleteStr:", liveReportDeleteStr);

    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    $(".modal-title").append(
        `<p> You cant pick more than 5 coins at the same time.</p >
            <p> Please choose a coin to replace.</p> `
    );


    for (let i = 0; i < liveReportDeleteStr.length; i++) {
        $(".modal-Replace").append(
            `<div class="card-body">
                <div>${liveReportDeleteStr[i].name}<button id="${liveReportDeleteStr[i].id}" type="button" class="btn btn-dark float-right" style="font-size:12px;" onclick="DeleteFromLiveReport(2)" >Replace</button> </div>
            </div>`
        )

        $(`#${liveReportDeleteStr[i].id} `).click(() => {
            console.log("liveReportDeleteStr[i].id:", liveReportDeleteStr[i].id)
            let replaceCoinId = liveReportDeleteStr[i].id;
            console.log("liveReportKickerStr:", liveReportDeleteStr)
            let newLiveArr = liveReportDeleteStr.filter(obj => obj.id !== liveReportDeleteStr[i].id);
            console.log(newLiveArr)
            newLiveArr.push(incomingCoin);
            console.log("newLiveArr:", newLiveArr);
            let newLiveARRJS = JSON.stringify(newLiveArr);
            localStorage.setItem("coins", newLiveARRJS);
            modal.style.display = "none"
            $(".modal-title").empty();
            $(".modal-Replace").empty();
            for (let i = 0; i < result.length; i++) {
                if (result[i].id == replaceCoinId) {
                    $(`#customSwitches${result[i].id}`).prop("checked", false)
                }

                // here i checked the incoming coin check box
                $(`#customSwitches${incomingCoin.id}`).prop("checked", true);
            }
        })
    }

    $("#AlertClose").click(() => {
        console.log(incomingCoin)
        console.log(CoinNumber)
        modal.style.display = "none";
        $(".modal-title").empty();
        $(".modal-Replace").empty();
        // $(`#customSwitches${result[CoinNumber].id}`).prop("checked", false)
    })

}

DeleteFromLiveReport = (newCoin) => {// this function so far do nutting, but it called on button click
    console.log("newCoin", newCoin);
}

