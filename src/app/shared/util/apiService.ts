import { API_ENDPOINTS } from "../apiConstants";

export const getMenuItems = async () => {
    const cachedItems = localStorage.getItem('menuItems');
    const parsedItems = cachedItems ? JSON.parse(cachedItems) : null;

    if (parsedItems && parsedItems?.length > 0) {
        // If cached items exist, use them
        return parsedItems;
    }

    const response = await fetch(API_ENDPOINTS.GET_MENU_ITEMS, {
        method: 'GET',
        headers: { 'identifier': 'staging' },
    });

    const data = await response.json();
    if (data.success) {
        localStorage.setItem('menuItems', JSON.stringify(data.data.menu_items));
        return data.data.menu_items;
    } else {
        throw new Error(data.message || 'Failed to fetch menu items');
    }
} 