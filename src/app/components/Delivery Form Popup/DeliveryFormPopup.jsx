import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';
import { useState } from 'react';
import CreateAddress from '../Create Address/CreateAddress'

const DeliveryFormPopup = ({ userAreas, showPickup, pickupAreas, open, handlePopupClose, onAreaSelect, fullScreen, areas, refreshAddresses, edit }) => {

    const [createAddressPopup, setCreateAddressPopup] = useState(false);

    const handleCreateAddressClose = () => {
        setCreateAddressPopup(false);
        refreshAddresses();
    };

    return (
        <>
            <Dialog fullScreen={fullScreen} open={open && !createAddressPopup} onClose={handlePopupClose}>
                <DialogTitle>Select Address</DialogTitle>
                <DialogContent>
                    {/* Delivery Addresses Block */}
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontWeight: 'bolder', fontSize: '17px' }}>Delivery Addresses</h3>
                        {
                            userAreas && userAreas.length > 0 ? (

                                userAreas.map((address) => (
                                    <div key={address.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                                        <p><strong style={{ fontWeight: 'bolder' }}><u>{address.name}</u></strong></p>
                                        <p><strong>Governorate:</strong> {address.governorate}</p>
                                        <p><strong>Area:</strong> {address.area}</p>
                                        <p><strong>Block:</strong> {address.block}</p>
                                        <p><strong>Street:</strong> {address.street}</p>
                                        <p><strong>Flat/Floor:</strong> {address.flat}/{address.floor}</p>
                                        <p><strong>Landmark:</strong> {address.landmark}</p>
                                        {address.is_default && <p style={{ color: 'green', fontWeight: 'bold' }}>* Default address</p>}

                                        {edit &&
                                            <Button
                                                onClick={() => onAreaSelect(address)}
                                            >
                                                Select
                                            </Button>
                                        }
                                    </div>
                                ))

                            ) : (
                                <div style={{ textAlign: 'center', color: '#aaa' }}>
                                    <p>You don&apos;t have any addresses saved</p>
                                </div>
                            )}
                    </div>

                    {/* Pickup Areas Block */}
                    {showPickup && <div>
                        <h3 style={{ fontWeight: 'bolder', fontSize: '17px' }}>Pickup Areas</h3>
                        {pickupAreas && pickupAreas.length > 0 ? (
                            pickupAreas.map((pickup) => (
                                <div key={pickup.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                                    <p><strong style={{ fontWeight: 'bolder' }}><u>{pickup.title}</u></strong></p>
                                    <Button onClick={() => onAreaSelect(pickup)}>Select</Button>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#aaa' }}>No pickup areas available.</p>
                        )}
                    </div>}
                </DialogContent>

                {/* create new address */}
                <p
                    style={{ textAlign: 'center' }}
                    onClick={() => setCreateAddressPopup(true)}>
                    <u>Add new address</u>
                </p>

                <DialogActions>
                    <Button onClick={handlePopupClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <Dialog fullScreen open={createAddressPopup} onClose={handleCreateAddressClose}>
                <CreateAddress
                    onClose={handleCreateAddressClose}
                    areas={areas}
                    refreshAddresses={refreshAddresses} />
            </Dialog>
        </>
    );
}

export default DeliveryFormPopup;