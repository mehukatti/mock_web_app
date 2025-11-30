import { getTotalCartCount } from './shoppingCartMemory.js';

updateCartCounterCircle();
/* Add event listener to
update the total count in the counter icon
*/
window.addEventListener("cartUpdated", (event) => {
    updateCartCounterCircle();
    console.log("Updated counter");
});

function updateCartCounterCircle() {
    /* Each time cart content is updated:
    1. Update the number inside the cart counter circle
    2. If cart counter reaches zero make the circle transparent.
    */
    const cartCount = getTotalCartCount();

    const cartCounterElement = document.getElementById("cartCounter");

    // If nothing in the cart
    if ( cartCount < 1 ) {
        cartCounterElement.innerHTML = "";
        cartCounterElement.style = "background-color"
    } else if ( cartCount > 99 ) {
        cartCounterElement.innerHTML = "99+";
    } else {
        cartCounterElement.innerHTML = cartCount;
    }
}