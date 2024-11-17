// apiConstants.js

export const API_BASE_URL = "https://staging.dietmaster.fit/api/customer";

// Define endpoints using the base URL
export const API_ENDPOINTS = {
    INITIAL: `${API_BASE_URL}/initial`,
    GET_MENU_ITEMS: `${API_BASE_URL}/menu_items`,

    LOGIN_URL: `${API_BASE_URL}/login`,
    LOGOUT_URL: `${API_BASE_URL}/logout`,
    SIGNUP_URL: `${API_BASE_URL}/register`,

    AREAS: `${API_BASE_URL}/areas`,
    GOVERNOR_RATES: `${API_BASE_URL}/governorates`,

    COUPON_CODE_VALIDATION: `${API_BASE_URL}/coupons/validate`,

    POST_ORDER: `${API_BASE_URL}/order`,
    GET_ORDERS: `${API_BASE_URL}/orders`,

    RESET_PASSWORD: `${API_BASE_URL}/password/reset`,
    UPDATE_PASSWORD: `${API_BASE_URL}/password/update`,
}