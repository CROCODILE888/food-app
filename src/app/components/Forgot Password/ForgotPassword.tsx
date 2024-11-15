import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";

const ForgotPassword = ({ open, onClose }) => {

    return (
        <div>
            <Dialog
                open={open}
                onClose={onClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const email = formJson.email;
                        const token = formJson.token;
                        console.log(email);
                        onClose();
                    },
                }}
            >
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Reset your password here
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="email"
                        label="Email Address"
                        type="email"
                        variant="standard"
                    />
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="token"
                        label="Token"
                        type="text"
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit">Reset</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default ForgotPassword;