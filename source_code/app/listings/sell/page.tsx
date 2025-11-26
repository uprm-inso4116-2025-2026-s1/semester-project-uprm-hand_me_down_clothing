import Link from 'next/link';
import React, { FC } from 'react'; 
import styles from './sell.module.css';


const sell: FC = () => {
  return (
    
    <div className={styles.pageContainer}>
      <div className={styles.mainBox}>
        <div className={styles.messageText}>
          OH! Looks like you haven't sold anything! Sell now!
        </div>
        <div className={styles.buttonContainer}>
          <Link href="/listings/sell_piece">
            <button className={styles.sellButton}>
              Sell
            </button>
          </Link>
        </div>
        <img
          src="/images/sellpage.jpg" 
          alt="Sell illustration"
          className={styles.sellImage}
        />
      </div>
    </div>
  );
}
export default sell;
