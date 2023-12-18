'use client';
import styles from '../page.module.css'
import ScheduleList from './scheduleList'

export default function Home() {
  return (
  <div className={styles.main}>
    <ScheduleList />
  </div>)
}