import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, DialogContentText } from "@mui/material";
import { resetPassword, updatePassword } from "@/shared/util/apiService";

const ForgotPassword = ({ open, onClose }) => {
    const [step, setStep] = useState(1); // Step 1: Request token, Step 2: Update password
    const [phoneNumber, setPhoneNumber] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Step 1: Handle token request
    const handleRequestToken = async (e) => {
        e.preventDefault();
        const resetPasswordData = new FormData();
        resetPasswordData.append('phone', phoneNumber);

        const response = await resetPassword(resetPasswordData);

        if (!response.success) {
            alert(response.message)
            throw new Error("Failed to send token. Please try again.");
        }
        alert(response.data.message);
        setStep(2); // Go to step 2 (update password)
    };

    // Step 2: Handle password update
    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        const updatePasswordData = new FormData();
        updatePasswordData.append('phone', phoneNumber);
        updatePasswordData.append('reset_password_token', token);
        updatePasswordData.append('password', newPassword);

        const response = await updatePassword(updatePasswordData);

        if (!response.success) {
            setErrorMessage(response.message)
            throw new Error("Failed to update password. Please try again.");
        }
        alert("Password updated successfully!");
        onClose(); // Close the dialog
    };

    return (
        <Dialog open={open}>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {step === 1
                        ? "Enter your phone number to receive a reset token."
                        : "Enter the token sent to your email along with your new password."}
                </DialogContentText>

                {/* Phone number input */}
                <TextField
                    required
                    margin="dense"
                    label="Phone Number"
                    type="text"
                    variant="standard"
                    fullWidth
                    inputProps={{ maxLength: 8 }}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />

                {/* Token input (Step 2 only) */}
                {step === 2 && (
                    <TextField
                        required
                        margin="dense"
                        label="Token"
                        type="text"
                        variant="standard"
                        fullWidth
                        inputProps={{ maxLength: 6 }}
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                )}

                {/* New Password input (Step 2 only) */}
                {step === 2 && (
                    <TextField
                        required
                        margin="dense"
                        label="New Password"
                        type="password"
                        variant="standard"
                        fullWidth
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                )}

                {/* Display error message */}
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>

                {/* Step 1 button: Request token */}
                {step === 1 ? (
                    <Button onClick={handleRequestToken}>Request Token</Button>
                ) : (
                    <Button onClick={handleUpdatePassword}>Update Password</Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ForgotPassword;
