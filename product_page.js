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
                updateProductTemplate(content);
            }
        }
        
    })
    .catch((error) => {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(`Error: ${error.message}`));
        document.body.insertBefore(p, mainContent);
    });
}

function updateProductTemplate(productData){
    // Update title
    document.title = productData.name;

    // Update image
    const parentImageElement = document.getElementById("image");
    const imageElement = document.createElement("img");
    imageElement.src = `products/images/${productData.image}`;
    imageElement.alt = productData.image;
    parentImageElement.appendChild(imageElement);

    // Update name
    const nameElement = document.getElementById("name");
    nameElement.innerHTML = productData.name;

    // Update product description
    const descriptionElement = document.getElementById("desc");
    descriptionElement.innerHTML = productData.description;
}