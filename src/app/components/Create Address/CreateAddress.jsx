import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

const CreateAddress = () => {
    return (
        <Dialog
            open={open}
            onClose={handlePopupClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries(formData.entries());
                    const email = formJson.email;
                    console.log(email);
                    handlePopupClose();
                },
            }}
        >
            <DialogTitle>Enter your new address details</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    margin="dense"
                    id="name"
                    name="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handlePopupClose}>Cancel</Button>
                <Button type="submit">Add new address</Button>
            </DialogActions>
        </Dialog>
    )
}

export default CreateAddress;