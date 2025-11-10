import { getCartContent } from './shoppingCartMemory.js';
import { createTextElement } from './commonFunctions.js';

//Create content from one json
const mainContent = createTextElement("div", "shopContainer", "");
mainContent.id = `productlist`;

document.body.appendChild(mainContent);

populateShoppingCartTable();

function populateShoppingCartTable() {
    var cartContents = getCartContent();

    // If shopping cart is empty, tell the user that
    if (jQuery.isEmptyObject(cartContents)) {
        const rowElement = createTextElement("div", "row", "");
        mainContent.appendChild(rowElement);

        const columnElement = createTextElement("div", "col-md-4", );
        rowElement.appendChild(columnElement);

        // Product container to get the desired styling
        
        const productElement = createTextElement("div", "productContainer", "Your shopping cart is empty.");
        columnElement.appendChild(productElement);
    } else {
        createShoppingCartTable(cartContents);
    }
}

function createShoppingCartTable(cartContents) {
    // The second "table" is bootstrap table
    const tableElement = createTextElement("table", "table");
    mainContent.appendChild(tableElement);

    // Create title row:
    const tableHeader = document.createElement("thead");
    tableElement.appendChild(tableHeader);
    const titleRow = document.createElement("tr");

    const titles = ["Name", "Price", "Units"];
    for (var title of titles) {
        var columnElement = createTextElement("th", "", title);
        titleRow.appendChild(columnElement);
    }
    tableHeader.appendChild(titleRow);

    // Table body
    const tableBody = document.createElement("tbody");

    for (const [productId, units]  of Object.entries(cartContents)) {

        createCartRow(parseInt(productId), parseInt(units))
        .then((tableRow) => {
            tableBody.appendChild(tableRow);;
        })
        .catch(console.error)
    }
    tableElement.appendChild(tableBody);
}

async function createCartRow(productId, units) {
    const tableRow = document.createElement("tr");

    // Read the product json to fetch rest of the product data:
    // Get the data from json
    const productData = await fetchProductData(productId);
    

    const nameElement = document.createElement("th");
    nameElement.textContent = productData.name;

    const priceElement = document.createElement("th");
    priceElement.textContent = productData.price;
    const unitElement = document.createElement("th");
    unitElement.textContent = units;

    tableRow.append(
        nameElement,
        priceElement,
        unitElement
    );

    return tableRow;
}

async function fetchProductData(productId) {
    const response = await fetch("products/products.json");
    if (!response.ok) {
        throw new Error(`readJSON Unable to fetch ${dataJson}. Status = ${response.status}`);
    }
    const data = await response.json();
    return data.find(p => parseInt(p.id) === parseInt(productId));
}