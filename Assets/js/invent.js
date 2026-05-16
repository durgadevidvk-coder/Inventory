

 
let products = JSON.parse(localStorage.getItem("products")) || [];
function saveData() {
  localStorage.setItem("products", JSON.stringify(products));
}
function generateBarcode() {
  return "GC" + Math.floor(100000 + Math.random() * 900000);
}
function addProduct() {

  let name = document.getElementById("name").value;
  let category = document.getElementById("category").value;
  let mfg = document.getElementById("mfg").value;
  let expiry = document.getElementById("expiry").value;
  let qty = document.getElementById("qty").value;
  let unit = document.getElementById("unit").value;
  let price = document.getElementById("price").value;
  let gst = 5;
  if (!name || !category || !qty || !unit || !price) {
    alert("Please fill required fields");
    return;
  }

  products.push({
     barcode: generateBarcode(),
    name,
    category,
    mfg,
    expiry,
    qty: Number(qty),
    unit,
    price: Number(price),
     gst: 5 
  });

  console.log(products); // 🔍 DEBUG (CHECK IN CONSOLE)
saveData();
  renderTable();
  updateDashboard();

  document.querySelectorAll("input, select").forEach(e => e.value = "");
}

function renderTable() {

  let table = document.getElementById("tableBody");

  if (!table) {
    console.error("tableBody not found!");
    return;
  }

  table.innerHTML = "";

  products.forEach((p, index) => {

    let total = p.qty * p.price;

    table.innerHTML += `
      <tr class="text-center border-b">
        <td>${index + 1}</td>
        <td class="font-mono text-blue-600"> ${p.barcode}</td>
        
        <td>${p.name}</td>
        <td>${p.category}</td>
        <td>${p.mfg}</td>
        <td>${p.expiry}</td>
        <td>${p.qty}</td>
        <td>${p.unit}</td>
        <td>${p.price}</td>
        <td>${total}</td>
       <td>
  <button onclick="editProduct(${index})"
    class="bg-blue-500 text-white px-3 py-1 rounded">
    Edit
  </button>

  <button onclick="deleteProduct(${index})"
    class="bg-red-500 text-white px-3 py-1 rounded">
    Delete
  </button>
</td>
      </tr>
    `;
  });
}



function deleteProduct(index) {
  products.splice(index, 1);
  saveData();
  renderTable();
  updateDashboard();
}

function updateDashboard() {

  let totalProducts = products.length;
  let totalQty = 0;
  let totalValue = 0;

  products.forEach(p => {
    totalQty += p.qty;
    totalValue += p.qty * p.price;
  });

  document.getElementById("totalProducts").innerText = totalProducts;
  document.getElementById("totalQty").innerText = totalQty;
  document.getElementById("totalValue").innerText = totalValue;
}
window.onload = function () {
  renderTable();
  updateDashboard();
};


let editIndex = -1;
function editProduct(index) {
  editIndex = index;

  let p = products[index];

  document.getElementById("editName").value = p.name;
  document.getElementById("editCategory").value = p.category;
  document.getElementById("editMfg").value = p.mfg;
  document.getElementById("editExpiry").value = p.expiry;
  document.getElementById("editQty").value = p.qty;
  document.getElementById("editUnit").value = p.unit;
  document.getElementById("editPrice").value = p.price;

  document.getElementById("editModal").classList.remove("hidden");
}
function closeEditModal() {
  document.getElementById("editModal").classList.add("hidden");
}
function updateProduct() {

  products[editIndex] = {
    barcode: products[editIndex].barcode,
    name: document.getElementById("editName").value,
    category: document.getElementById("editCategory").value,
    mfg: document.getElementById("editMfg").value,
    expiry: document.getElementById("editExpiry").value,
    qty: Number(document.getElementById("editQty").value),
    unit: document.getElementById("editUnit").value,
    price: Number(document.getElementById("editPrice").value)
  };

  saveData(); // if using localStorage (optional)
  renderTable();
  updateDashboard();

  closeEditModal();
}

function generateBillPDF() {

  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  let y = 10;
  let grandTotal = 0;

  // 🏪 HEADER
  doc.setFontSize(16);
  doc.text("MSD GROCERY", 65, y);

  y += 8;
  doc.setFontSize(10);
  doc.text("No.12, Chennai, Tamil Nadu", 70, y);

  y += 5;
  doc.text("Phone: +91 9876543210", 75, y);

  y += 10;

  // 📅 DATE
  let date = new Date();
  doc.text("Date: " + date.toLocaleDateString(), 10, y);
  doc.text("Time: " + date.toLocaleTimeString(), 140, y);

  y += 10;

  // 📦 TABLE HEADER (COLUMNS)
  doc.setFontSize(10);
  doc.text("S.No", 10, y);
  doc.text("Product", 25, y);
  doc.text("Qty", 80, y);
  doc.text("Price", 100, y);
  doc.text("GST", 120, y);
  doc.text("Total", 140, y);

  y += 5;
  doc.line(10, y, 200, y); // horizontal line

  y += 8;

  // 📦 ITEMS
  products.forEach((p, index) => {

    let base = p.qty * p.price;
    let gstAmount = (base * 5) / 100;
    let total = base + gstAmount;

    grandTotal += total;

    doc.text(String(index + 1), 10, y);
    doc.text(String(p.name), 25, y);
    doc.text(String(p.qty), 80, y);
    doc.text(String(p.price), 100, y);
    doc.text("5%", 120, y);
    doc.text(total.toFixed(2), 140, y);

    y += 8;
  });

  y += 5;
  doc.line(10, y, 200, y);

  y += 10;

  // 💰 GRAND TOTAL
  doc.setFontSize(12);
  doc.text("Grand Total (Incl. 5% GST): Rs " + grandTotal.toFixed(2), 10, y);

  y += 10;

  // 🧾 FOOTER
  doc.setFontSize(10);
  doc.text("Thank you for shopping with us!", 60, y);

  doc.save("Grocery_Bill.pdf");
}
