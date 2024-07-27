let datafiled = document.getElementsByClassName("datafilled")[0];
const form = document.querySelector("form");
const monthDropdown = document.getElementById("monthDropdown");
const searchInput = form.querySelector('input[type="search"]');
let selectedMonth = monthDropdown.value;
let monthValue = monthDropdown.options[monthDropdown.selectedIndex].text;
let search = searchInput.value;
let stats = document.getElementsByClassName("stats")[0];


let priceRangeChart; 


const getData = async () => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/combined-data?month=${selectedMonth}&search=${search}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const displayData = async () => {
  const data = await getData();
  datafiled.innerHTML = "";
  if (data) {
    data.transactions.forEach((element) => {
      let elem = ` <tr>
            <th scope="row">${element.id}</th>
            <td>${element.title}</td>
            <td>${element.description}</td>
            <td>${element.price}</td>
            <td>${element.category}</td>
             <td><img src=${element.image} width="100px" height="100px" /></td>
             </tr>
            `;
      datafiled.innerHTML += elem;
    });
    console.log(data);

    let totalSale = data.statistics.totalSales;
    let sold = data.statistics.totalSoldItems;
    let notSold = data.statistics.totalNotSoldItems;
    stats.innerHTML = "";
    let nextelem = `<h1>Statistics-${monthValue}</h1>
        <div class="data">
          <div class="vals"> <h2>Total sale</h2>
            <h2>${parseInt(totalSale)}</h2>
          </div>
         <div class="vals">
          <h2>Total sold item</h2>
          <h2>${sold}</h2>
         </div>
         <div class="vals">
          <h2>Total not sold item</h2>
          <h2>${notSold}</h2>
         </div>
        </div>`;
    stats.innerHTML = nextelem;

    const priceData = data.barChart; 
    const labels = priceData.map(item => item.priceRange);
    const values = priceData.map(item => item.count);

    if (priceRangeChart) {
      priceRangeChart.destroy();
    }

    const ctx = document.getElementById('priceRangeChart').getContext('2d');
    priceRangeChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Products in Price Range',
          data: values,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });


  }
};

monthDropdown.addEventListener("change", (event) => {
  event.preventDefault();
  monthValue = monthDropdown.options[monthDropdown.selectedIndex].text;
  selectedMonth = monthDropdown.value;
  displayData();
});

document.addEventListener("DOMContentLoaded", () => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    monthValue = monthDropdown.options[monthDropdown.selectedIndex].text;
    selectedMonth = monthDropdown.value;
    search = searchInput.value;
    console.log("Selected Month:", selectedMonth);
    console.log("Search Term:", search);
    displayData();
  });
});

displayData();