// interfaces/apiResponse.ts
// Generic API response interface
export interface API_RESPONSE<T = unknown> {
    success: boolean;
    code: number;
    message: string;
    data: T;
}