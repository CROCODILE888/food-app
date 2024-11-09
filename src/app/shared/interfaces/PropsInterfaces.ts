export interface AuthFormProps {
    isLogin: boolean;
    onSubmit: (formData: FormData) => void;
    success: boolean;
    message: string;
}