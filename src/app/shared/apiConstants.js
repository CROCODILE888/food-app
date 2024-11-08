// apiConstants.js

export const API_BASE_URL = "https://staging.dietmaster.fit/api/customer";

// Define endpoints using the base URL
export const API_ENDPOINTS = {
    LOGIN_URL: `${API_BASE_URL}/login`,
    SIGNUP_URL: `${API_BASE_URL}/register`,
    GET_MENU_ITEMS: `${API_BASE_URL}/menu_items`
}