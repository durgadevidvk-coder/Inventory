let products =
JSON.parse(localStorage.getItem("products")) || [];

function renderExpiryProducts() {

  let table =
    document.getElementById("expiryTable");

  table.innerHTML = "";

  let expired = 0;
  let expiringSoon = 0;
  let safe = 0;

  let today = new Date();

  products.forEach((p, index) => {

    let expiryDate =
      new Date(p.expiry);

    let diffTime =
      expiryDate - today;

    let diffDays =
      Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let status = "";
    let color = "";

    // EXPIRED
    if (diffDays < 0) {

      status = "Expired";
      color = "text-red-500 font-bold";

      expired++;
    }

    // EXPIRING SOON
    else if (diffDays <= 7) {

      status = "Expiring Soon";
      color = "text-yellow-500 font-bold";

      expiringSoon++;
    }

    // SAFE
    else {

      status = "Safe";
      color = "text-green-600 font-bold";

      safe++;
    }

    table.innerHTML += `

      <tr class="text-center border-b">

        <td class="p-3">${index + 1}</td>

        <td>${p.name}</td>

        <td>${p.category}</td>

        <td>${p.expiry}</td>

        <td class="${color}">
          ${status}
        </td>

      </tr>
    `;
  });

  // UPDATE COUNTS
  document.getElementById("expiredCount").innerText =
    expired;

  document.getElementById("expiringSoonCount").innerText =
    expiringSoon;

  document.getElementById("safeCount").innerText =
    safe;
}

window.onload = function () {

  renderExpiryProducts();
};