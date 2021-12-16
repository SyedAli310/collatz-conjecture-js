let prevChart=null;

// function to calculate collatz sequence
async function getCollatzConjectureOutput(inputVal) {
  let resultSeries = [];
  let totalSteps = 0;
  let evenSteps = 0;
  let oddSteps = 0;

  if (inputVal <= 0) {
    return {
      error: true,
      errorMsg: "input needs to be a positive number",
    };
  } else if (isNaN(inputVal)) {
    return {
      error: true,
      errorMsg: "input needs to be a number",
    };
  } else {
    while (inputVal != 1) {
      totalSteps++;
      if (inputVal % 2 == 0) {
        evenSteps++;
        inputVal = inputVal / 2;
        resultSeries.push(inputVal);
      } else if (inputVal % 2 != 0) {
        oddSteps++;
        inputVal = inputVal * 3 + 1;
        resultSeries.push(inputVal);
      }
    }

    return {
      error: false,
      resultSeries,
      totalSteps,
      oddSteps,
      evenSteps,
    };
  }
}

// function to plot the chart [chart.js]
function makeChart(data,inputVal) {
    const plugin = {
      id: "custom_canvas_background_color",
      beforeDraw: (chart) => {
        const ctx = chart.canvas.getContext("2d");
        ctx.save();
        ctx.globalCompositeOperation = "destination-over";
        ctx.fillStyle = "#1b1b1b";
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      },
    };
    var ctx = document.getElementById("myChart").getContext("2d");
    var myChart = new Chart(ctx, {
      type: "line",
      plugins: [plugin],
      data: {
        labels: data.resultSeries,
        datasets: [
          {
            label: `Collatz Conjecture Plot for ${inputVal}`,
            data: data.resultSeries,
            pointBackgroundColor: "hsl(48, 100%, 67%)",
            backgroundColor: "rgba(0, 181, 300, 0.24)",
            borderColor: "hsl(348, 100%, 61%)",
            hoverBorderColor: "hsl(141, 71%, 48%)",
            color: "hsl(217, 71%, 53%)",
            borderWidth: 1,
            fill: true,
          },
        ],
      },
      options: {
        legend: {
          labels: {
            fontColor: "lightgreen",
            fontSize: 10,
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: "lightgreen",
                fontSize: 10,
                precision: 0,
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                fontColor: "lightgreen",
                precision: 0,
                beginAtZero: true,
                fontSize: 10,
              },
            },
          ],
        },
      },
    });
    return myChart;
}

// check and clear chart
function clearChart() {
  if (prevChart != null) {
    prevChart.destroy();
  }
}

// show output to html
async function showOutput(inp){
  const result = await getCollatzConjectureOutput(localStorage.getItem('inputVal') || inp);
  console.log(result);
  if (result.error) {
    $('#errModal .modal-body').html(`<h4 class="text-danger">${result.errorMsg}</h4>`)
    $("#errModal").modal("show");
  } else {
    clearChart();
    prevChart = makeChart(result,localStorage.getItem('inputVal') || inp);
    const resSeriesOutput = result.resultSeries.join(" <i class='fas fa-arrow-right fa-sm text-success m-2'></i> ");
    $(".collatz-head").html(`Collatz Conjecture Plot for <span class='text-success'>${localStorage.getItem('inputVal') || inp}</span>`);
    $("#output").html(`
    <hr class="bg-light">
    <div class='w-100'>
        <h1 class='text-center'>Series</h1>
        <h4 class='text-center'><span class='badge badge-dark badge-pill text-success '>Highest Value - ${Math.max(...result.resultSeries)}</span></h4>
        <h5 class='d-flex justify-content-evenly align-items-center flex-wrap'>${resSeriesOutput}</h5>
    </div>
    `);
    $("#counts").html(`
    <div class='w-100 text-center'>
        <h1>Counts</h1>
        <p class='d-inline-block bg-dark p-2 rounded'>Odd Steps: ${result.oddSteps} </p>
        <i class='fas fa-plus'></i>
        <p class='d-inline-block bg-dark p-2 rounded'>Even Steps: ${result.evenSteps} </p>
        <i class='fas fa-equals'></i>
        <p class='d-inline-block bg-dark p-2 rounded'>Total Steps: ${result.totalSteps}</p>
    </div>
    `);
  }
}

$("#main-form").on("submit", async (e) => {
  e.preventDefault();
  const inp = $("#number-input").val();
  localStorage.setItem("inputVal", inp);
  showOutput(inp);
});

$(".show-hide-series").on('click',()=>{
  if($('.show-hide-series').text()=="Show Series"){
    $('.show-hide-series').text("Hide Series");
    setTimeout(()=>{
      $('html,body').animate({scrollTop: $("#output").offset().top}, 'slow');
    },100)
  }
  else if($('.show-hide-series').text()=="Hide Series"){
    $('.show-hide-series').text("Show Series");
  }


})

window.onload = () => {
  if(localStorage.getItem('inputVal') && !(parseInt(localStorage.getItem('inputVal'))<=0) && !isNaN(localStorage.getItem('inputVal'))) {
    $("#number-input").val(localStorage.getItem('inputVal'));
    showOutput(localStorage.getItem('inputVal'));
  }
}