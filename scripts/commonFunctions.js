import { updateProductQuantityInShoppingCart, getProductQuantity } from './shoppingCartMemory.js';

export function createTextElement(type, className, value){
    var element = document.createElement(type); // Would like this to be a explanation element type
    element.className = className;
    element.textContent = value;
    return element;
}

export function createUnitSelector(productId) {
    /* Create unit selector that is input field
    but has bigger minus and plus signs on each side of the input field.
    Also unit is displayed between the input field and the plus sign
    */

    const inputContainerElement = document.createElement("div");
    inputContainerElement.className = "unitSelectorContainer d-flex p-2 flex-row justify-content-around align-items-center";

    // Minus button
    const minusButton = document.createElement("button");
    const minusIcon = createTextElement("div", "glyphicon glyphicon-minus", ""); // From bootstrap
    minusIcon.alt = "-";
    minusButton.append(minusIcon);
    // If clicked, minus one from the cart and update the input value
    minusButton.addEventListener('click', ()=>{
        updateProductQuantityInShoppingCart(productId, -1);
        inputElement.value = getProductQuantity(productId);
    });

    // Numeric input
    const inputElement = document.createElement("input");
    inputElement.className = "unitSelector";
    inputElement.type = "number";
    inputElement.value = getProductQuantity(productId);
    inputElement.min = 1;
    inputElement.step = 1;
    inputElement.max = 999;
    inputElement.autocomplete = false;

    inputElement.addEventListener('input', function (evt) {
        updateProductQuantityInShoppingCart(productId, inputElement.value - getProductQuantity(productId));
    });

    // Unit
    const unitElement = document.createElement("span");
    unitElement.innerHTML = "kg";

    // Plus button
    const plusButton = document.createElement("button");
    const plusIcon = createTextElement("div", "glyphicon glyphicon-plus", ""); // From bootstrap
    plusIcon.alt = "+";
    plusButton.append(plusIcon);
    // If clicked, plus one from the cart and update the input value
    plusButton.addEventListener('click', ()=>{
        updateProductQuantityInShoppingCart(productId, 1);
        inputElement.value = getProductQuantity(productId);
    });

    // Append all parts to the container
    inputContainerElement.append(
        minusButton,
        inputElement,
        unitElement,
        plusButton
    );
    return inputContainerElement;
}

