import { getCartContent } from './shoppingCartMemory.js';
import { createTextElement } from './commonFunctions.js';

//Create content from one json
const mainContent = createTextElement("div", "shopContainer", "");
mainContent.id = `productlist`;

document.body.appendChild(mainContent);

const tableContainerElement = createTextElement("div", "tableContainer");
mainContent.appendChild(tableContainerElement);

populateShoppingCartTable();

function populateShoppingCartTable() {
    var cartContents = getCartContent();

    // If shopping cart is empty, tell the user that
    if (jQuery.isEmptyObject(cartContents)) {
        // Product container to get the desired styling
        const productElement = createTextElement("div", "productContainer", "Your shopping cart is empty.");
        tableContainerElement.appendChild(productElement);
    } else {
        createShoppingCartTable(cartContents);
    }
}

function createShoppingCartTable(cartContents) {
    // The second "table" is bootstrap table
    const tableElement = createTextElement("table", "table");
    tableContainerElement.appendChild(tableElement);

    // Create title row:
    const tableHeader = document.createElement("thead");
    tableElement.appendChild(tableHeader);
    const titleRow = document.createElement("tr");

    const titles = ["Image", "Name", "Price", "Units", "Total"];
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

    // Create mini image and link
    // Container for the link and image
    var columnElement = createTextElement("th", "", value);
    tableRow.appendChild(columnElement);
    createImageLink(columnElement, productData);

    for (var value of [productData.name, `${productData.price.toString()} ${productData.unit}`, `${units.toString()} kg`, `${(units*productData.price).toString()} €`]){
        var columnElement = createTextElement("th", "", value);
        tableRow.appendChild(columnElement);
    }

    return tableRow;
}

function createImageLink(columnElement, productData) {
    /* Create Link to the product with image of the product inside the given columnElement.
    <a href="product.html?productId=3">
        <img class="miniImageContainer" src="products/images/orange.png" alt="orange.png">
    </a>
    */

    // a href element
    const linkElement = document.createElement("a");
    linkElement.href = `product.html?productId=${productData.id}`;
    columnElement.appendChild(linkElement);

    // Image element inside a href element
    const imageElement = createTextElement("img", "miniImageContainer", "");
    imageElement.src = `products/images/${productData.image}`;
    imageElement.alt = productData.image;
    linkElement.appendChild(imageElement);
}

async function fetchProductData(productId) {
    const response = await fetch("products/products.json");
    if (!response.ok) {
        throw new Error(`readJSON Unable to fetch ${dataJson}. Status = ${response.status}`);
    }
    const data = await response.json();
    return data.find(p => parseInt(p.id) === parseInt(productId));
}