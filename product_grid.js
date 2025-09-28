var document;

//Create content from one json
const mainContent = document.createElement("class");
mainContent.className = "shopContainer";
mainContent.id = `productlist`;
//mainContent.textContent = "This appears"

document.body.appendChild(mainContent);

readJSON(`products/products.json`);

function readJSON(dataJson){
    newList = createTextElement("class", "shopContainer", "");
    mainContent.appendChild(newList);

    // Read the json
    fetch(dataJson)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`readJSON Unable to fetch ${dataJson}. Status = ${response.status}`);
        }
        return response.json();
    })

    .then((data) => {
        for (var content of data){
            //Create sub content on subtitle level
            createProductView(content, newList);
        }
        
    })
    .catch((error) => {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(`Error: ${error.message}`));
        document.body.insertBefore(p, mainContent);
    });
}

function createProductView(productData, newList){
    // Create the product element to contain name, and image of the product.
    const productElement = document.createElement("div");
    productElement.className = "lightContainer";
    newList.appendChild(productElement);

    // Add image of the product.
    const imageElement = document.createElement("img");
    imageElement.src = `products/images/${productData.image}`;
    imageElement.alt = productData.image;
    productElement.appendChild(imageElement);

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