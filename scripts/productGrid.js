import { createTextElement, createUnitSelector } from './commonFunctions.js';

//Create content from one json
const mainContent = createTextElement("div", "shopContainer", "");
mainContent.id = `productlist`;

document.body.appendChild(mainContent);

readJSON(`products/products.json`);

function readJSON(dataJson){

    // Read the json
    fetch(dataJson)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`readJSON Unable to fetch ${dataJson}. Status = ${response.status}`);
        }
        return response.json();
    })

    .then((data) => {

        // Each row has 3 columns
        var columnCounter = 0;
        var rowElement = document.createElement("div");
        rowElement.className = "row";
        mainContent.appendChild(rowElement);

        for (var content of data){
            //Create sub content on subtitle level
            columnCounter = columnCounter + 1;
            if (columnCounter == 4){
                var rowElement = document.createElement("div");
                rowElement.className = "row";
                mainContent.appendChild(rowElement);
                columnCounter = 0;
            }
            createProductView(content, rowElement);
        }
        
    })
    .catch((error) => {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(`Error: ${error.message}`));
        document.body.insertBefore(p, mainContent);
        console.log(error);
    });
}

function createProductView(productData, collectionElement){
    // Create view for one product

    //Bootstrap column
    const columnElement = document.createElement("div");
    columnElement.className = "col-md-4";
    collectionElement.appendChild(columnElement);

    // Product container to get the desired styling
    const productElement = document.createElement("div");
    productElement.className = "productContainer";
    columnElement.appendChild(productElement);

    // Add image of the product with a link
    var linkElement = document.createElement("a");
    linkElement.href = `product.html?productId=${productData.id}`;
    productElement.appendChild(linkElement);
    const imageElement = document.createElement("img");
    imageElement.src = `products/images/${productData.image}`;
    imageElement.alt = productData.image;
    linkElement.appendChild(imageElement);

    // Container for other product data
    const productDataContainer = createTextElement("div", "productDataContainer", "");
    productElement.appendChild(productDataContainer);

    // Add product name to it
    var linkElement = createTextElement("a", "normalLink", productData.name);
    linkElement.href = `product.html?productId=${productData.id}`;
    linkElement
    const sub = createTextElement("div", "productName", "");
    sub.appendChild(linkElement);
    productDataContainer.appendChild(sub);

    // Show first 100 char of description and add "..." if the description is longer.
    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = descriptionReview(productData.description);
    productDataContainer.appendChild(descriptionElement);

    createShopRow(productDataContainer, productData);
}

function createShopRow(productElement, productData){
    // Shop row
    const shopRowElement = document.createElement("div");
    shopRowElement.className = "d-flex flex-row justify-content-between align-items-center";
    productElement.appendChild(shopRowElement);

    // Price tag
    const priceElement = document.createElement("div");
    priceElement.textContent = `${productData.price.toString()} ${productData.unit}`;
    shopRowElement.appendChild(priceElement);

    // Unit selector
    const inputElement = createUnitSelector(productData.id);
    shopRowElement.appendChild(inputElement);
}

function descriptionReview(desc){
    if (desc.length > 100){
        return desc.substring(0,100).concat("...");
    } else {
        return desc;
    }
}