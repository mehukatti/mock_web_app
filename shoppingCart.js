// Name of the cart in the browser's localStorage
var cartKeyName = "mockWebAppCart";

/*
Due to localStorage properties, productId is as String in localStorage.
*/

export function addProductShoppingCart(productId, units) {
    let mockWebAppCart = getCartContent();

    // Is the product in the cart already?
    if ( mockWebAppCart.hasOwnProperty(String(productId)) ) {
        // If the productId is in the mockWebAppCart, add to it
        mockWebAppCart[productId] = mockWebAppCart[productId] + units;
    } else {
        // If the productId is not in the mockWebAppCart, add it
        mockWebAppCart[productId] = units;
    }
    
    localStorage.setItem(cartKeyName, JSON.stringify(mockWebAppCart));
}

export function getCartContent() {
    // Get mockWebAppCart or assume empty list
    const mockWebAppCart = JSON.parse(localStorage.getItem(cartKeyName)) || {};
    return mockWebAppCart;
}