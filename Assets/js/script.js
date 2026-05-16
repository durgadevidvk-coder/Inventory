let products =
  JSON.parse(localStorage.getItem("products")) || [];

// GLOBAL CHART VARIABLE
let myChart = null;

// DASHBOARD
function updateDashboard() {

  let totalProducts = products.length;

  let totalQty = 0;

  let totalValue = 0;

  let lowStock = 0;

  products.forEach(p => {

    totalQty += p.qty;

    let total = p.qty * p.price;

    let gst = (total * 5) / 100;

    totalValue += total + gst;

    // LOW STOCK
    if (p.qty <=2) {
      lowStock++;
    }
  });

  // UPDATE UI
  document.getElementById("totalProducts").innerText =
    totalProducts;

  document.getElementById("totalQty").innerText =
    totalQty;

  document.getElementById("totalValue").innerText =
    "₹" + totalValue.toFixed(2);

  document.getElementById("lowStock").innerText =
    lowStock;

  // CREATE CHART
  createChart(totalProducts, lowStock, totalQty);
}

// CHART FUNCTION
function createChart(productsCount, lowStock, qty) {

  // DESTROY OLD CHART
  if (myChart !== null) {
    myChart.destroy();
  }

  let ctx =
    document.getElementById("myChart");

  myChart = new Chart(ctx, {

    type: "doughnut",

    data: {

      labels: [
        "Products",
        "Low Stock",
        "Quantity"
      ],

      datasets: [{

        data: [
          productsCount,
          lowStock,
          qty
        ],

        backgroundColor: [
          "#22c55e",
          "#ef4444",
          "#3b82f6"
        ]

      }]
    },

    options: {

      responsive: true,

      maintainAspectRatio: false
    }
  });
}

// AUTO LOAD
window.onload = function () {

  updateDashboard();
};
    