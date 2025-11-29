import { getCartContent, isCartEmpty, getProductQuantity, clearCart } from './shoppingCartMemory.js';
import { createTextElement, createUnitSelector } from './commonFunctions.js';

//Create content from one json
const mainContent = createTextElement("div", "shopContainer", "");
mainContent.id = `productlist`;

document.body.appendChild(mainContent);

const tableContainerElement = createTextElement("div", "tableContainer");
mainContent.appendChild(tableContainerElement);

populateShoppingCartTable();

function populateShoppingCartTable() {
    // If shopping cart is empty, tell the user that
    if (isCartEmpty()) {
        // Product container to get the desired styling
        const productElement = createTextElement("div", "productContainer", "Your shopping cart is empty.");
        tableContainerElement.appendChild(productElement);
    } else {
        var cartContents = getCartContent();
        createClearShoppingCartButton();
        createShoppingCartTable(cartContents);
    }
}

function createClearShoppingCartButton() {
    /* Create a button that:
    1. Sets all item quantities in cart to zero
    2. Removes the table.
    */

    // The button:
    const clearingButton = document.createElement("button");
    clearingButton.className = "basicButtonStyle";
    clearingButton.innerHTML = "Clear cart"
    tableContainerElement.appendChild(clearingButton);

    // Add event listener to clear cart contains and update the table
    clearingButton.addEventListener('click', ()=>{
        clearCart();
        clearingButton.remove();
        const cartElement = document.getElementById("cartTable");
        cartElement.remove();
        populateShoppingCartTable();
    });
}

function createShoppingCartTable(cartContents) {
    // The second "table" is bootstrap table
    const tableElement = createTextElement("table", "table-primary colorTheme");
    tableElement.id = "cartTable";
    tableContainerElement.appendChild(tableElement);

    // Create title row:
    const tableHeader = document.createElement("thead");
    tableElement.appendChild(tableHeader);
    const titleRow = document.createElement("tr");

    const titles = ["Product", "Price", "Quantity", "Total"];
    for (var title of titles) {
        var columnElement = document.createElement("th");
        columnElement.scope = "col";
        columnElement.innerHTML = title;
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
            tableBody.insertBefore(tableRow, tableBody.childNodes[0]);
        })
        .catch(console.error)
    }
    // Total row, but add to document only lastly
    const totalRow = createTotalRow();
    tableBody.appendChild(totalRow);
    tableElement.appendChild(tableBody);
}

async function createCartRow(productId, units) {
    const tableRow = document.createElement("tr");

    // Read the product json to fetch rest of the product data:
    // Get the data from json
    const productData = await fetchProductData(productId);

    // Create mini image and link
    // Container for the link and image
    var columnElement = createTextElement("th", "align-middle");
    columnElement.scope = "row";
    tableRow.appendChild(columnElement);
    createImageLink(columnElement, productData);

    // Price
    var value = `${productData.price.toString()} ${productData.unit}`;
    var columnElement = createTextElement("td", "align-middle", value);
    tableRow.appendChild(columnElement);

    // Unit selector
    var columnElement = createTextElement("td", "align-middle", "");
    tableRow.appendChild(columnElement);
    const inputElement = createUnitSelector(productData.id);
    columnElement.appendChild(inputElement);

    // Total cost
    var rowTotalPriceElement = createTextElement("td", "align-middle", `${(units*productData.price).toString()} €`);
    tableRow.appendChild(rowTotalPriceElement);

    /* Add event listener to
    update the price in case the quantity of this product was changed.
    update the whole page if the new quantity is zero.
    update the total row at the same time
    */
    window.addEventListener("cartUpdated", (event) => {
        if (event.detail.productId === productId) {
            const updatedUnits = getProductQuantity(productId);
            if ( updatedUnits == 0 ) {
                // If the new quantity is zero, reload the whole page to remove null rows.
                //location.reload();
                console.log("Somehow enable updating the table in WCAG 2.1 compliant way");
                tableRow.remove(); // Is this way compliant with the WCAG 2.1?
            } else {
                // Otherwise update the price
                rowTotalPriceElement.textContent = `${(updatedUnits * productData.price).toString()} €`;
                // Update the total price too
                var totalPriceElement = document.getElementById("totalPrice");
                totalCartPrice()
                .then((totalPrice) => {
                    totalPriceElement.textContent = `${totalPrice.toString()} €`;
                })
                .catch(console.error)
            }
        }
    });

    return tableRow;
}

function createTotalRow() {
    /* Create total row, where there is only text "Total" and the total sum.
    */
    var cartContents = getCartContent();
    const totalRow = document.createElement("tr");
    
    // Gotta create empty columns to match the column spacing
    for (var title of ["", "", "Total"]) {
        var columnElement = createTextElement("th", "align-middle", title);
        totalRow.appendChild(columnElement);
    }
    var totalPriceElement = createTextElement("th", "align-middle", "");
    // Calculate the total price
    totalCartPrice()
    .then((totalPrice) => {
        totalPriceElement.textContent = `${totalPrice.toString()} €`;
        totalPriceElement.id = "totalPrice";
        totalRow.appendChild(totalPriceElement);
    })
    .catch(console.error)
    return totalRow
}

async function totalCartPrice() {
    var cartContents = getCartContent();
    var total = 0;

    // Iterate cart
    for (const [productId, units]  of Object.entries(cartContents)) {
        if ( units == 0 ) {
            continue;
        }
        const productData = await fetchProductData(productId);
        total = total + (productData.price * units);
    }
    return total;
}

async function fetchProductData(productId) {
    const response = await fetch("products/products.json");
    if (!response.ok) {
        throw new Error(`readJSON Unable to fetch ${dataJson}. Status = ${response.status}`);
    }
    const data = await response.json();
    return data.find(p => parseInt(p.id) === parseInt(productId));
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
    const linkElementName = createTextElement("a", "normalLink", productData.name)
    linkElementName.href = `product.html?productId=${productData.id}`;
    columnElement.appendChild(linkElementName);
}