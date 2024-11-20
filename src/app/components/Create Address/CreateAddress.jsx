import { addAddress } from "@/shared/util/apiService";
import { Button, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";

const CreateAddress = ({ onClose, areas, refreshAddresses }) => {
    const [formData, setFormData] = useState({
        area: '',
        block: '',
        street: '',
        houseName: '',
        apartmentNo: '',
        phone: '',
    });

    const [loginData, setLoginData] = useState({});
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            const loginData = JSON.parse(localStorage.getItem('loginData') || '{}');
            setLoginData(loginData);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "area") {
            const selectedArea = areas.find(area => area.title === value);
            setFormData({
                ...formData,
                area: selectedArea, // Store the entire area object
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) return;
        setIsSubmitting(true);

        const addressData = new FormData();

        addressData.append('customer_id', loginData?.customer?.id);
        addressData.append('governorate_id', formData.area.governorate_id);
        addressData.append('area_id', formData.area.id);
        addressData.append('slot_id', 0);
        addressData.append('name', formData.houseName);
        addressData.append('phone', formData.phone);
        addressData.append('block', formData.block);
        addressData.append('street', formData.street);
        addressData.append('flat', formData.apartmentNo);

        const addAddressResponse = await addAddress(addressData, loginData.customer.session_token);
        if (!addAddressResponse.success) {
            alert(addAddressResponse.message);
            setIsSubmitting(false);
            return;
        }
        alert("New address has been added successfully");
        refreshAddresses();
        onClose();
        setIsSubmitting(false);
    };
    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <DialogTitle>Add a new address</DialogTitle>
            <DialogContent>

                <h3 style={{ marginBottom: '10px' }}>Please fill the following address fields</h3>

                <TextField
                    label="Contact number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                />

                <FormControl fullWidth>
                    <InputLabel id="area-select-label">Select Area</InputLabel>
                    <Select
                        labelId="area-select-label"
                        name="area"
                        value={formData.area ? formData.area.title : ''}
                        onChange={handleChange}
                        required
                    >
                        <MenuItem value="" disabled>
                            Select Area
                        </MenuItem>
                        {areas.map((area) => (
                            <MenuItem key={area.id} value={area.title}>
                                {area.title}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Block"
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <TextField
                    label="Street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <TextField
                    label="House Name"
                    name="houseName"
                    value={formData.houseName}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <TextField
                    label="Apartment No"
                    name="apartmentNo"
                    value={formData.apartmentNo}
                    onChange={handleChange}
                    fullWidth
                    required
                />

                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color={isSubmitting ? 'warning' : 'primary'}
                        disabled={isSubmitting}
                    >
                        Submit
                    </Button>
                </DialogActions>

            </DialogContent>
        </form>
    )
}

export default CreateAddress;