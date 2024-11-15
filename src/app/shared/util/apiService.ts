import { API_ENDPOINTS } from "../apiConstants";

// Cache memory will expire every hour.
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000;

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
        headers: { 'identifier': 'staging' },
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
        headers: { 'identifier': 'staging' },
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
        headers: { 'identifier': 'staging' },
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
        headers: { 'identifier': 'staging' },
    });

    const initialDataResponse = await initialData.json();
    if (initialDataResponse.success) {
        localStorage.setItem('initialData', JSON.stringify(initialDataResponse.data));
        return initialDataResponse.data;
    } else {
        throw new Error(initialDataResponse.message || 'Failed to fetch initial data');
    }
}

export const postValidate = async (API: string | URL | Request, formData: FormData) => {
    try {
        const response = await fetch(API, {
            method: 'POST',
            headers: { 'identifier': 'staging' },
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
    // const sessionToken = localStorage.getItem('sessionToken'); // retrieve session token

    const formData = new FormData();
    formData.append('customer_id', customerId); // add customer_id to form-data

    try {
        const response = await fetch(API_ENDPOINTS.LOGOUT_URL, {
            method: 'POST',
            headers: {
                'Authorization': sessionToken,
                'identifier': 'staging'
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

export const validateCouponCode = async (couponCode, customerId, sessionToken) => {

    try {
        const url = `${API_ENDPOINTS.COUPON_CODE_VALIDATION}?customer_id=${customerId}&coupon_code=${couponCode}`;
        const validationDataResponse = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': sessionToken,
                'identifier': 'staging'
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

export const makeOrder = async (orderData: FormData) => {
    try {
        const response = await fetch(API_ENDPOINTS.POST_ORDER, {
            method: 'POST',
            headers: { 'identifier': 'staging' },
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