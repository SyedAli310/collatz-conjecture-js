const showHideSeriesBtnSpan = document.querySelector(".show-hide-series span");
const showHideSeriesBtnIcon = document.querySelector(".show-hide-series i");
let prevChart = null;
let prevChartEvenOdd = null;

// function to calculate collatz sequence
async function getCollatzConjectureOutput(inputVal) {
  let resultSeries = [];
  let totalSteps = 0;
  let evenSteps = 0;
  let oddSteps = 0;
  let inputValCopy = Number(inputVal);
  if (inputVal <= 0) {
    return {
      error: true,
      inputValCopy,
      errorMsg: "input needs to be a positive number",
    };
  } else if (isNaN(inputVal)) {
    return {
      error: true,
      inputValCopy,
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
      inputValCopy,
      resultSeries,
      totalSteps,
      oddSteps,
      evenSteps,
    };
  }
}

// function to plot the collatz conjecture steps chart [chart.js]
function makeChart(data, inputVal) {
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
          pointBackgroundColor: "#dc3545",
          backgroundColor: "rgba(6, 18, 50, 0.4)",
          borderColor: "lightblue",
          hoverBorderColor: "lightseagreen",
          color: "green",
          borderWidth: 1,
          fill: true,
        },
      ],
    },
    // options: {
    //   legend: {
    //     labels: {
    //       fontColor: "lightgreen",
    //       fontSize: 10,
    //     },
    //   },
    //   scales: {
    //     yAxes: [
    //       {
    //         ticks: {
    //           fontColor: "lightgreen",
    //           fontSize: 10,
    //           precision: 0,
    //           beginAtZero: true,
    //         },
    //       },
    //     ],
    //     xAxes: [
    //       {
    //         ticks: {
    //           fontColor: "lightgreen",
    //           precision: 0,
    //           beginAtZero: true,
    //           fontSize: 10,
    //         },
    //       },
    //     ],
    //   },
    // },
  });

  return myChart;
}

// function to make even-ood pie chart
function makeEvenOddPieChart(data, inputVal) {
  const evenOddData = [data.evenSteps, data.oddSteps];
  var ctx2 = document.getElementById("myChartPie").getContext("2d");
  var myChartPie = new Chart(ctx2, {
    type: "pie",
    data: {
      labels: ["Even Steps", "Odd Steps"],
      datasets: [
        {
          label: "Even - Odd Steps Distribution for " + inputVal,
          data: evenOddData,
          backgroundColor: ["#fd7e14", "#6610f2"],
        },
      ],
    },
  });
  return myChartPie;
}

// check and clear chart
function clearCharts() {
  if (prevChart != null && prevChartEvenOdd != null) {
    prevChart.destroy();
    prevChartEvenOdd.destroy();
  }
}

// show output to html
async function showOutput(inp) {
  localStorage.setItem("inputVal", inp);
  const result = await getCollatzConjectureOutput(
    localStorage.getItem("inputVal") || inp
  );
  console.log(result);
  if (result.error) {
    const canTry = isNaN(inp)
      ? Math.abs(inp.charCodeAt(Math.floor(Math.random() * inp.length)))
      : Math.abs(inp);
    console.log(typeof canTry + " - ", canTry);
    $("#errModal .modal-body .error-view").html(
      `
      <h4>${result.errorMsg}</h4>
      You entered <u>${
        isNaN(inp) ? "string" : "negative"
      }</u> <i class='text-danger'>'${
        localStorage.getItem("inputVal") || inp
      }'</i>
       <br>
      Try <span class='text-light bg-success p-1 rounded' onclick="showOutput(${Math.abs(
        canTry
      )})" title='Enter ${canTry}' style='cursor:pointer;'>${canTry}&nbsp;<i class='fas fa-external-link-alt fa-sm'></i></span>
      `
    );
    $("#errModal").modal("show");
  } else {
    $("#errModal").modal("hide");
    $("#number-input").val(localStorage.getItem("inputVal"));
    clearCharts();
    prevChart = makeChart(result, localStorage.getItem("inputVal") || inp);
    prevChartEvenOdd = makeEvenOddPieChart(
      result,
      localStorage.getItem("inputVal") || inp
    );
    const resSeriesOutput = result.resultSeries.join(
      " <i class='fas fa-arrow-right fa-sm text-success m-2'></i> "
    );
    $(".collatz-head").html(
      `Collatz Conjecture Plots for <span class='text-success'>${
        localStorage.getItem("inputVal") || inp
      }</span>`
    );
    $(".collatz-even-odd-head").html(
      `Even-Odd Distribution Plot<span class='text-success'></span>`
    );
    $("#output").html(`
    <hr class="bg-light">
    <div class='w-100'>
        <h1 class='text-center'>Steps</h1>
        <h4 class='text-center'><span class='badge badge-dark badge-pill text-success '>Highest Value - ${Math.max(
          ...result.resultSeries
        )}</span></h4>
        <h5 class='d-flex justify-content-evenly align-items-center flex-wrap'>${resSeriesOutput}</h5>
    </div>
    `);
    $("#stats").html(`
    <div class='w-100 text-center' style='user-select:none;'>
        <h1>Stats</h1>

        <p class='text-primary'>
        <i>The Collatz Conjecture of the number 
        <b class='text-success'>${result.inputValCopy}</b> 
        took a total of 
        <b class='text-warning'>${result.totalSteps}</b> 
        steps to reach 1 including 
        <b class='text-light'>${result.evenSteps}</b> 
        even steps and 
        <b class='text-light'>${result.oddSteps}</b> 
        odd steps
        </i>
        </p>

        <p class='d-inline-block bg-dark p-2 rounded'>Odd Steps: ${result.oddSteps} </p>
        <i class='fas fa-plus'></i>
        <p class='d-inline-block bg-dark p-2 rounded'>Even Steps: ${result.evenSteps} </p>
        <i class='fas fa-equals'></i>
        <p class='d-inline-block bg-dark p-2 rounded'>Total Steps: <span class='text-warning'>${result.totalSteps}</span></p>
    </div>
    `);
  }
}

$("#main-form").on("submit", async (e) => {
  e.preventDefault();
  const inp = $("#number-input").val();
  showOutput(inp);
});

$(".show-hide-series").on("click", () => {
  if (showHideSeriesBtnSpan.innerText == "Show Steps" && !$(".collapse").hasClass("show")) {
    showHideSeriesBtnSpan.innerText = "Hide Steps";
    showHideSeriesBtnIcon.style.transform = "rotate(180deg)";
    localStorage.setItem("showSeries", true);
    setTimeout(() => {
      $("html,body").animate({ scrollTop: $("#output").offset().top }, "slow");
    }, 100);
  } else if (showHideSeriesBtnSpan.innerText == "Hide Steps" && $(".collapse").hasClass("show")) {
    showHideSeriesBtnSpan.innerText = "Show Steps";
    showHideSeriesBtnIcon.style.transform = "rotate(0deg)";
    localStorage.setItem("showSeries", false);
  }
});

window.onload = () => {
  if (
    localStorage.getItem("inputVal") &&
    !(parseInt(localStorage.getItem("inputVal")) <= 0) &&
    !isNaN(localStorage.getItem("inputVal"))
  ) {
    $("#number-input").val(localStorage.getItem("inputVal"));
    showOutput(localStorage.getItem("inputVal"));
  }
  if (localStorage.getItem("showSeries") == "true") {
    showHideSeriesBtnSpan.innerText = "Hide Steps";
    showHideSeriesBtnIcon.style.transform = "rotate(180deg)";
    $(".collapse").addClass("show");
  }
  if (localStorage.getItem("showSeries") == "false") {
    showHideSeriesBtnSpan.innerText = "Show Steps";
    showHideSeriesBtnIcon.style.transform = "rotate(0deg)";
    $(".collapse").removeClass("show");
  }
};
