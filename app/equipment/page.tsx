'use client';
import styles from '../page.module.css'
import DataGridDemoTest from './equipmentGridTest';

export default function Home() {
    return (
        <div className={styles.main} style={{marginTop: "-40px"}}>
            <DataGridDemoTest />
        </div>)
}