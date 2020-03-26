

LoadLiveReport = () => {

    $(`#charContainerId`).empty();

    $(`#charContainerId`).append(`<div id="chartContainer" style="margin-top:50px; width:900px; height:400px;"></div>`);

    let localStorageData = localStorage.getItem("coins")
    let LiveReportData = JSON.parse(localStorageData);
    console.log(LiveReportData);

    var chart = new CanvasJS.Chart("chartContainer", {

        title: {
            text: "Live report coins value in US Dollars"

        },
        axisX: {
            title: "Coins:"
        },
        axisY: {
            title: "USD",
            suffix: " $"
        },

        data: [
        ]
    });
    chart.render();

    for (let i = 0; i < LiveReportData.length; i++) {
        console.log(LiveReportData[i])
        let coinSymbol = LiveReportData[i].symbol.toUpperCase();

        chart.options.data.push({
            type: "spline",
            name: LiveReportData[i].name,
            showInLegend: true,
            dataPoints: []
        })


        setInterval(function () {
            dateForX = new Date();
            $.get(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinSymbol}&tsyms=USD`, (res) => {
                console.log(res[coinSymbol].USD)
                chart.options.data[i].dataPoints.push({ x: dateForX, y: res[coinSymbol].USD });
                chart.render();
            })
        }, 2000);
    }
}

