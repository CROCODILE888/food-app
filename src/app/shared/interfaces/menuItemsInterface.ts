// interfaces/menuItemInterfaces.ts

import { API_RESPONSE } from './apiResponseInterface';

export interface Configuration {
    delivery_cost: number;
    minimum_order_cost: number;
}

export interface Recipe {
    id: number;
    title: string;
    a_title: string;
    measure_unit: string;
    quantity: number;
    is_mandatory_for_menu_item: number;
}

export interface TypeData {
    id: number;
    slug: string;
    name: string;
    a_name: string;
    attachment: string;
    price: number;
    is_active: number;
    description: string;
    a_description: string;
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
    fiber: number;
    recipe_text: string;
    recipes: Recipe[];
}

export interface MenuItems {
    type_name: string;
    type_data: TypeData[];
}

// Specific type for menu items data in the API response
export interface MenuItemsData {
    configurations: Configuration;
    menu_items: MenuItems[];
}

// Define the response type for menu items endpoint
export type MenuItemsResponse = API_RESPONSE<MenuItemsData>;
