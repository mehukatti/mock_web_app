var document;

//Create content from one json
const mainContent = document.createElement("div");
mainContent.className = "shopContainer";
mainContent.id = `productlist`;
//mainContent.textContent = "This appears"

document.body.appendChild(mainContent);

const productId = getProductName('productId');

getProductData(productId, `products/products.json`)

function getProductName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getProductData(productId, dataJson){

    // Read the json
    fetch(dataJson)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`readJSON Unable to fetch ${dataJson}. Status = ${response.status}`);
        }
        return response.json();
    })

    .then((data) => {

        // Select product that has correct productId

        for (var content of data){
            if (content.id == productId){
                // Each row has 3 columns
                var columnCounter = 0;
                var rowElement = document.createElement("div");
                rowElement.className = "row";
                mainContent.appendChild(rowElement);
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
        }
        
    })
    .catch((error) => {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(`Error: ${error.message}`));
        document.body.insertBefore(p, mainContent);
    });
}

function createProductView(productData, collectionElement){
    // Create the product element to contain name, and image of the product.
    const columnElement = document.createElement("div");
    columnElement.className = "col-sm-4";
    collectionElement.appendChild(columnElement);

    const productElement = document.createElement("div");
    productElement.className = "productContainer";
    columnElement.appendChild(productElement);

    // Add image of the product.
    const linkElement = document.createElement("a");
    linkElement.href = `product?productId=${productData.id}`
    productElement.appendChild(linkElement);
    const imageElement = document.createElement("img");
    imageElement.src = `products/images/${productData.image}`;
    imageElement.alt = productData.image;
    linkElement.appendChild(imageElement);

    // Add product name to it
    sub = createTextElement("div", "productName", productData.name);
    productElement.appendChild(sub);

    // Show first 100 char of description and add "..." if the description is longer.
    const descriptionElement = document.createElement("p");
    descriptionElement.textContent = descriptionReview(productData.description);
    productElement.appendChild(descriptionElement);
}

function descriptionReview(desc){
    if (desc.length > 100){
        return desc.substring(0,100).concat("...");
    } else {
        return desc;
    }
}

function createTextElement(type, className, value){
    const element = document.createElement(type); // Would like this to be a explanation element type
    element.className = className;
    element.textContent = value;
    return element;
}