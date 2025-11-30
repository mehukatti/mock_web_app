// Name of the cart in the browser's localStorage
var cartKeyName = "mockWebAppCart";

/*
Due to localStorage properties, productId is as String in localStorage.
*/

export function updateProductQuantityInShoppingCart(productId, units) {
    /* Update the quantity of the product in the shopping cart.
    The unit can be negative also.
    Prevent the content of the cart from becoming negative.
    */
    let mockWebAppCart = getCartContent();

    // Is the product in the cart already?
    if ( mockWebAppCart.hasOwnProperty(String(productId)) ) {
        mockWebAppCart[productId] = Math.max(
            0,
            mockWebAppCart[productId] + parseInt(units)
        );
        
    } else if ( parseInt(units) > 0 ) {
        // If the productId is not in the mockWebAppCart, add it
        mockWebAppCart[productId] = parseInt(units);
    }
    
    localStorage.setItem(cartKeyName, JSON.stringify(mockWebAppCart));
    
    // Notify listeners that the cart changed
    window.dispatchEvent(new CustomEvent("cartUpdated", {
        detail: { productId }
    }));
    console.log("Updated cart in localStorage");
}

export function clearCart() {
    /* Remove the whole cart from the localStorage
    */
    localStorage.removeItem(cartKeyName);
    console.log("Removed cart from localStorage");
}

export function getCartContent() {
    // Get mockWebAppCart or assume empty list
    const mockWebAppCart = JSON.parse(localStorage.getItem(cartKeyName)) || {};
    return mockWebAppCart;
}

export function isCartEmpty() {
    /* Unable to use localStorage.setItem() to replace existing json with one that has one key deleted.
    Therefore, there may be left some keys with zero quantities
    */
    var mockWebAppCart = getCartContent();
    if ( Object.keys(mockWebAppCart).length == 0 ) {
        // There is no items in localStorage
        return true;
    }

    // Iterate cart to see if there is any non zero product
    for (const [productId, units]  of Object.entries(mockWebAppCart)) {
        if ( units > 0 ) {
            return false;
        }
    }
    // If all were zero, cart is empty.
    return true;
}

export function getTotalCartCount() {
    /* Count the total number of items in the cart */
    var totalCount = 0;

    const mockWebAppCart = getCartContent();

    // Iterate cart
    for (const [productId, units]  of Object.entries(mockWebAppCart)) {
        if ( units > 0 ) {
            totalCount += parseInt(units);
        }
    }
    return totalCount;
}

export function getProductQuantity(productId) {
    /* Return the quantity of the product in the cart
    If the product is not in the cart, return zero
    */
    let mockWebAppCart = getCartContent();
    // Is the product in the cart already?
    if ( mockWebAppCart.hasOwnProperty(String(productId)) ) {
        // If the productId is in the mockWebAppCart, add to it
        return parseInt(mockWebAppCart[productId]);
    } else {
        // If the productId is not in the mockWebAppCart, return
        return 0;
    }
}