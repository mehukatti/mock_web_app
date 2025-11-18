export function createTextElement(type, className, value){
    var element = document.createElement(type); // Would like this to be a explanation element type
    element.className = className;
    element.textContent = value;
    return element;
}

export function createUnitSelector() {
    // Unit selector
    const inputElement = document.createElement("input");
    inputElement.className = "unitSelector";
    inputElement.type = "number";
    inputElement.value = 1;
    inputElement.min = 1;
    inputElement.step = 1;
    inputElement.max = 999;
    inputElement.autocomplete = false;
    return inputElement;
}