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
    const toastInputContainer = document.createElement("div"); //create extra container to align toast properly.


    const inputContainerElement = document.createElement("div");
    toastInputContainer.appendChild(inputContainerElement);
    inputContainerElement.className = "unitSelectorContainer d-flex p-2 flex-row justify-content-around align-items-center";

    // Toast region
    const toastRegion = createToastRegionForCartUpdates();
    toastInputContainer.appendChild(toastRegion);

    // Minus button
    const minusButton = document.createElement("button");
    const minusIcon = createTextElement("i", "bi bi-dash", ""); // From bootstrap
    minusIcon.alt = "-";
    minusButton.append(minusIcon);
    // If clicked, minus one from the cart and update the input value
    minusButton.addEventListener('click', ()=>{
        updateProductQuantityInShoppingCart(productId, -1);
        inputElement.value = getProductQuantity(productId);
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastRegion);
        toastBootstrap.show();
    });

    // Disable if quantity is zero
    minusButton.disabled = true;
    if ( getProductQuantity(productId) > 0 ) {
        minusButton.disabled = false;
    }

    // Event listener to update the disabled status of the button if cart contents is updated.
    window.addEventListener("cartUpdated", (event) => {
        if (event.detail.productId === productId) {
            const updatedUnits = getProductQuantity(productId);
            if ( updatedUnits < 1 ) {
                minusButton.disabled = true;
                console.log("Disabled the minus");
            } else {
                minusButton.disabled = false;
                console.log("Enabled the minus");
            }
        }
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

    // Accessibility requirement: Must be able to exit with enter or return key.
    inputElement.addEventListener( 'keypress', function(event) {
        if ( event.key === "Enter" ) {
            inputElement.blur();
        }
    });

    // Update the quantity in the cart based on new quantity.

    inputElement.addEventListener('change', function (evt) {
        updateProductQuantityInShoppingCart(productId, inputElement.value - getProductQuantity(productId));
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastRegion);
        toastBootstrap.show();
    });

    // Unit
    const unitElement = document.createElement("span");
    unitElement.innerHTML = "kg";

    // Plus button
    const plusButton = document.createElement("button");
    const plusIcon = createTextElement("i", "bi bi-plus", ""); // From bootstrap
    plusIcon.alt = "+";
    plusButton.append(plusIcon);
    // If clicked, plus one from the cart and update the input value
    plusButton.addEventListener('click', ()=>{
        updateProductQuantityInShoppingCart(productId, 1);
        inputElement.value = getProductQuantity(productId);
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastRegion);
        toastBootstrap.show();
    });

    // Append all parts to the container
    inputContainerElement.append(
        minusButton,
        inputElement,
        unitElement,
        plusButton
    );
    return toastInputContainer;
}

function createToastRegionForCartUpdates() {
    /*
    Create toast region similar to:
    <div class="toast align-items-center text-bg-primary border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body">
            Hello, world! This is a toast message.
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    </div>

    */
    const toastElement = createTextElement("div", "toast toastStyle");

    // Accessibility settings
    toastElement.role = "alert";
    toastElement.setAttribute("aria-live", "assertive");
    toastElement.setAttribute("aria-atomic", "true");

    // Container to add closing button and text

    const flexContainer = createTextElement("div", "d-flex", "");
    toastElement.appendChild(flexContainer);

    const toastBody = createTextElement("div", "toast-body", "Cart updated.");
    flexContainer.append(toastBody);

    const closeButton = createTextElement("button", "btn-close me-2 m-auto", "");
    closeButton.setAttribute("data-bs-dismiss", "toast");
    closeButton.setAttribute("aria-label", "Close");
    closeButton.style = "color:black;"
    flexContainer.append(closeButton);
    
    return toastElement;
}