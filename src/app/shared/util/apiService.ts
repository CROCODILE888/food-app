import { API_ENDPOINTS } from "../apiConstants";

// Cache memory will expire every hour.
const CACHE_EXPIRATION_TIME = 3 * 1000;

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
        localStorage.setItem('menuItems', JSON.stringify(initialDataResponse.data));
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