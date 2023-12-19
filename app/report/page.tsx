'use client';
import styles from '../page.module.css'
import ChartData from "./barChart";
import EnhancedTable from './repairTable';
import RentData from './useChart';
import CountData from './rentableChart';

export default function Home() {
    return (
        <div className={styles.main} style={{marginBottom: "50px", marginTop: "-40px"}}>
            <ChartData />
            <br/><hr/><br/>
            <RentData />
            {/* <br/><hr/><br/>
            <CountData /> */}
            <br/><hr/><br/>
            <EnhancedTable />
        </div>
    );    
}