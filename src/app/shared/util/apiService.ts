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