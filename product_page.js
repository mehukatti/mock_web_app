var document;

//Create content from one json
const mainContent = document.createElement("div");
mainContent.className = "shopContainer";
mainContent.id = `productlist`;
//mainContent.textContent = "This appears"

document.body.appendChild(mainContent);

const fruit = getProductName('fruit');
productElement = createTextElement("div", "shopContainer", fruit);
mainContent.appendChild(productElement);

function getProductName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function createTextElement(type, className, value){
    const element = document.createElement(type); // Would like this to be a explanation element type
    element.className = className;
    element.textContent = value;
    return element;
}