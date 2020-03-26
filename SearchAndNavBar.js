
// reload coins on homepage when click on HomePage btn
GoToHomePage = () => {
    location.reload();
}

// Search for Coin by clicking the search button

GetCoinBySearchINP = () => {
    console.log(document.getElementById("SearchInput").value)
    let coinId = document.getElementById("SearchInput").value;
    let CoinBySearchURL = `${GlobalURL + coinId}`;
    console.log(CoinBySearchURL)

    $.ajax(
        {
            type: 'GET',
            datatype: 'json',
            url: CoinBySearchURL,
            success: function (data) {
                console.log(CoinBySearchURL);
                CoinBySearch = data;
                PrintCoinBySearch(CoinBySearch)
                console.log("data:", data, "Url:", CoinBySearchURL)
            },
            error: function (error) {
                console.log("error : ", error);
            }
        }
    );
}

// Print a specicif coin by Search Input 
PrintCoinBySearch = () => {
    console.log("CoinBySearch:", CoinBySearch)
    let str = ``;
    for (i = 0; i < result.length; i++)
        if (result[i].name == CoinBySearch.name) {
            str += `<div class="card container mt-5"`;
            str += `<div class="card" style="width: 18rem;">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-xl-10">
                                            <h5 class="card-title">${result[i].name} </h5>
                                        </div>`;
            if (liveReportCheck.some(obj => obj.name === result[i].name)) {
                console.log(`${result[i].name} is exist`);
                str += ` <div class="col-xl-2">
                            <div class="custom-control custom-switch float-right">
                                <input checked type="checkbox" class="custom-control-input" id="customSwitches${result[i].id}" onclick="switchChange(${i})">
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
                    <div class="collapse" id="collapseExample${i}">
                        <div class="spinner-border mt-5" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>`
            str += `</div ></div> </div> `;
        }
    document.getElementById("charContainerId").innerHTML = str;
}

