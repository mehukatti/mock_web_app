var document;

//Create content from one json
const mainContent = document.createElement("class");
mainContent.className = "shopContainer";
mainContent.id = `productlist`;
//mainContent.textContent = "This appears"

document.body.appendChild(mainContent);

readJSON(`products/products.json`);

function readJSON(dataJson){
    newList = createTextElement("class", "lightContainer", "");
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
            sub = createTextElement("h1", "darkContainer", content.name);
            newList.appendChild(sub);
        }
        
    })
    .catch((error) => {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(`Error: ${error.message}`));
        document.body.insertBefore(p, mainContent);
    });
}

function createTextElement(type, className, value){
    const element = document.createElement(type); // Would like this to be a explanation element type
    element.className = className;
    element.textContent = value;
    return element;
}