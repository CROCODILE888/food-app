import { CircularProgress } from "@mui/material";
import styles from './Loader.module.css'

export const Loader = () => {
    return (
        <div className={styles.loaderContainer}>
            <CircularProgress />
        </div>
    );
}