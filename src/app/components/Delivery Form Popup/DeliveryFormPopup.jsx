import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from '@mui/material';

const DeliveryFormPopup = ({ userAreas, open, handlePopupClose, onAreaSelect }) => {

    return (
        <Dialog open={open} onClose={handlePopupClose}>
            <DialogTitle>Select Delivery Address</DialogTitle>
            {
                userAreas && userAreas.length > 0 ?
                    <DialogContent>
                        {userAreas.map((address) => (
                            <div key={address.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
                                <p><strong style={{ fontWeight: 'bolder' }}><u>{address.name}</u></strong></p>
                                <p><strong>Governorate:</strong> {address.governorate}</p>
                                <p><strong>Area:</strong> {address.area}</p>
                                <p><strong>Block:</strong> {address.block}, <strong>Street:</strong> {address.street}</p>
                                <p><strong>Flat/Floor:</strong> {address.flat}/{address.floor}</p>
                                <p><strong>Landmark:</strong> {address.landmark}</p>
                                {address.is_default && <p style={{ color: 'green', fontWeight: 'bold' }}>* Default address</p>}
                                <Button
                                    onClick={() => onAreaSelect(address)}
                                >
                                    Select
                                </Button>
                            </div>
                        ))}
                    </DialogContent> :
                    <DialogContent>
                        <div style={{ textAlign: 'center', color: '#aaa' }}>
                            <p>You don&apos;t have any addresses saved</p>
                        </div>                    </DialogContent>}
            <DialogActions>
                <Button onClick={handlePopupClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeliveryFormPopup;