import { API_ENDPOINTS } from "../apiConstants";

// Cache memory will expire every hour.
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000;

// GET calls
export const getMenuItems = async () => {

    const cachedItems = localStorage.getItem('menuItems');
    const cachedTimestamp = localStorage.getItem('menuItemsTimestamp');

    // If cached data exists
    if (cachedItems && cachedTimestamp) {
        const timestamp = parseInt(cachedTimestamp);
        const parsedItems = JSON.parse(cachedItems);

        // If the cached data is not expired, return it
        if (Date.now() - timestamp < CACHE_EXPIRATION_TIME) {
            return parsedItems;
        }
    }

    const response = await fetch(API_ENDPOINTS.GET_MENU_ITEMS, {
        method: 'GET',
        headers: { 'identifier': 'secret-oven' },
    });

    const data = await response.json();
    if (data.success) {
        localStorage.setItem('menuItems', JSON.stringify(data.data.menu_items));
        localStorage.setItem('menuItemsTimestamp', Date.now().toString());
        return data.data.menu_items;
    } else {
        throw new Error(data.message || 'Failed to fetch menu items');
    }
}

export const getAreas = async () => {

    const areasData = await fetch(API_ENDPOINTS.AREAS, {
        method: 'GET',
        headers: { 'identifier': 'secret-oven' },
    });

    const areasDataResponse = await areasData.json();
    if (areasDataResponse.success) {
        return areasDataResponse.data.areas;
    } else {
        throw new Error(areasDataResponse.message || 'Failed to fetch areas');
    }
}

export const getGovernorates = async () => {

    const governoratesData = await fetch(API_ENDPOINTS.GOVERNOR_RATES, {
        method: 'GET',
        headers: { 'identifier': 'secret-oven' },
    });

    const governoratesDataResponse = await governoratesData.json();
    if (governoratesDataResponse.success) {
        return governoratesDataResponse.data.areas;
    } else {
        throw new Error(governoratesDataResponse.message || 'Failed to fetch areas');
    }
}

export const getInitialData = async () => {

    const cachedInitialData = localStorage.getItem('initialData');

    // If cached data exists
    if (cachedInitialData) {
        const parsedInitialData = JSON.parse(cachedInitialData);
        return parsedInitialData;
    }

    const initialData = await fetch(API_ENDPOINTS.INITIAL, {
        method: 'GET',
        headers: { 'identifier': 'secret-oven' },
    });

    const initialDataResponse = await initialData.json();
    if (initialDataResponse.success) {
        localStorage.setItem('initialData', JSON.stringify(initialDataResponse.data));
        return initialDataResponse.data;
    } else {
        throw new Error(initialDataResponse.message || 'Failed to fetch initial data');
    }
}

export const validateCouponCode = async (couponCode, customerId, sessionToken) => {

    try {
        const url = `${API_ENDPOINTS.COUPON_CODE_VALIDATION}?customer_id=${customerId}&coupon_code=${couponCode}`;
        const validationDataResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': sessionToken,
                'identifier': 'secret-oven'
            },

        });

        const result = await validationDataResponse.json();
        if (result.success) {
            // Coupon validated successfully
            return {
                success: true,
                data: result.data.coupon // { type: "absolute", value: 25 } OR { type: "percentage", value: 10 } 
            };
        } else {
            // Handle unsuccessful validation
            return {
                success: false,
                message: result.message
            };
        }
    } catch (error) {
        console.error("Error validating coupon:", error);
        return {
            success: false,
            message: "Failed to validate coupon code"
        };
    }
}

export const getOrderDetailsByCustomerId = async (customerId) => {

    try {
        const url = `${API_ENDPOINTS.GET_ORDERS}?customer_id=${customerId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'identifier': 'secret-oven' },
        });

        const result = await response.json();
        if (result.success) {
            console.log(result.data.orders)
            return {
                success: true,
                data: result.data.orders
            };
        } else {
            return {
                success: false,
                message: result.message
            };
        }

    } catch (error) {
        console.error("Error fetching orders:", error);
        return {
            success: false,
            message: "Failed to fetch order details"
        };
    }
}

export const getUserAreas = async (customerId, sessionToken) => {

    try {
        const url = `${API_ENDPOINTS.ADDRESSES}?customer_id=${customerId}&customer_subscription_id=1`;
        const userAreasResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': sessionToken,
                'identifier': 'secret-oven'
            },
        });

        const result = await userAreasResponse.json();
        if (result.success) {
            return {
                success: true,
                data: result.data
            };
        } else {
            return {
                success: false,
                message: result.message
            };
        }
    } catch (error) {
        console.error("Error fetching user areas:", error);
        return {
            success: false,
            message: "Failed to fetch user areas"
        };
    }
}

// POST calls
export const postValidate = async (API: string | URL | Request, formData: FormData) => {
    try {
        const response = await fetch(API, {
            method: 'POST',
            headers: { 'identifier': 'secret-oven' },
            body: formData,
        })
        const data = await response.json();

        if (data.success) {
            return { success: true, data }
        }
        else {
            return { success: false, message: data.message || 'Failed to validate' }
        }
    } catch (error) {
        console.error('Error: ', error)
        return { success: false, message: 'An error occurred during validation. Please try again.' }
    }
}

export const logout = async (customerId, sessionToken) => {

    const formData = new FormData();
    formData.append('customer_id', customerId); // add customer_id to form-data

    try {
        const response = await fetch(API_ENDPOINTS.LOGOUT_URL, {
            method: 'POST',
            headers: {
                'Authorization': sessionToken,
                'identifier': 'secret-oven'
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            return { success: true, data };
        } else {
            return { success: false, message: data.message || 'Logout failed' };
        }
    } catch (error) {
        console.log('Logout error:', error);
        return { success: false, message: 'An error occurred during logout.' };
    }
};

export const makeOrder = async (orderData: FormData, customerId) => {
    const url = customerId > 0 ? `${API_ENDPOINTS.POST_ORDER}?customer_id=${customerId}` : API_ENDPOINTS.POST_ORDER;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'identifier': 'secret-oven' },
            body: orderData,
        })
        const data = await response.json();

        if (data.success) {
            return { success: true, data }
        }
        else {
            return { success: false, message: data.message || 'Failed to checkout.' }
        }
    } catch (error) {
        console.error('Error: ', error)
        return { success: false, message: 'An error occurred during checkout. Please try again.' }
    }
}

export const resetPassword = async (resetPasswordData: FormData) => {
    try {
        const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
            method: 'POST',
            headers: { 'identifier': 'secret-oven' },
            body: resetPasswordData,
        })
        const data = await response.json();

        if (data.success) {
            return { success: true, data }
        }
        else {
            return { success: false, message: data.message || 'Failed to reset password.' }
        }
    } catch (error) {
        console.error('Error: ', error)
        return { success: false, message: 'An error occurred during fetching reset password token. Please try again.' }
    }
}

export const updatePassword = async (updatePasswordData: FormData) => {
    try {
        const response = await fetch(API_ENDPOINTS.UPDATE_PASSWORD, {
            method: 'POST',
            headers: { 'identifier': 'secret-oven' },
            body: updatePasswordData,
        })
        const data = await response.json();

        if (data.success) {
            return { success: true, data }
        }
        else {
            return { success: false, message: data.message || 'Failed to update password.' }
        }
    } catch (error) {
        console.error('Error: ', error)
        return { success: false, message: 'An error occurred during password update. Please try again.' }
    }
}

export const addAddress = async (addAddressData: FormData, sessionToken) => {
    try {
        const response = await fetch(API_ENDPOINTS.ADDRESSES, {
            method: 'POST',
            headers: {
                'Authorization': sessionToken,
                'identifier': 'secret-oven'
            },
            body: addAddressData,
        })
        const data = await response.json();

        if (data.success) {
            return { success: true, data }
        }
        else {
            return { success: false, message: data.message || 'Failed to add address' }
        }
    } catch (error) {
        console.error('Error: ', error)
        return { success: false, message: 'An error occurred during adding address. Please try again.' }
    }
}