import { getCartContent } from './shoppingCartMemory.js';
import { createTextElement, createUnitSelector } from './commonFunctions.js';

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

    const titles = ["Product", "Price", "Quantity", "Total"];
    for (var title of titles) {
        var columnElement = createTextElement("th", "", title);
        titleRow.appendChild(columnElement);
    }
    tableHeader.appendChild(titleRow);

    // Table body
    const tableBody = document.createElement("tbody");

    for (const [productId, units]  of Object.entries(cartContents)) {
        if ( units == 0 ) {
            continue;
        }

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

    // Image and 
    for (var value of [`${productData.price.toString()} ${productData.unit}`]){
        var columnElement = createTextElement("th", "", value);
        tableRow.appendChild(columnElement);
    }

    // Unit selector
    const inputElement = createUnitSelector(productData.id);
    tableRow.appendChild(inputElement);

    // Total cost
    var columnElement = createTextElement("th", "", `${(units*productData.price).toString()} €`);
    tableRow.appendChild(columnElement);

    return tableRow;
}

function createImageLink(columnElement, productData) {
    /* Create Link to the product with image of the product inside the given columnElement.
    <a href="product.html?productId=3">
        <img class="miniImageContainer" src="products/images/orange.png" alt="orange.png">
    </a>
    <a href="product.html?productId=1">Apple</a>
    */

    // Image element inside a href element
    const linkElementImage = document.createElement("a");
    linkElementImage.href = `product.html?productId=${productData.id}`;
    columnElement.appendChild(linkElementImage);

    
    const imageElement = createTextElement("img", "miniImageContainer", "");
    imageElement.src = `products/images/${productData.image}`;
    imageElement.alt = productData.image;
    linkElementImage.appendChild(imageElement);

    // Name of the product too as a link
    const linkElementName = document.createElement("a");
    linkElementName.href = `product.html?productId=${productData.id}`;
    linkElementName.innerHTML = productData.name
    columnElement.appendChild(linkElementName);


}

async function fetchProductData(productId) {
    const response = await fetch("products/products.json");
    if (!response.ok) {
        throw new Error(`readJSON Unable to fetch ${dataJson}. Status = ${response.status}`);
    }
    const data = await response.json();
    return data.find(p => parseInt(p.id) === parseInt(productId));
}