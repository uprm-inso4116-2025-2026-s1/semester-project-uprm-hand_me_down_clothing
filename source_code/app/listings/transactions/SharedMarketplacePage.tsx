import Link from "next/link";
import styles from "./marketplace.module.css";

interface Props {
  mode: "sell" | "donate"; 
}

export default function SharedMarketplacePage({ mode }: Props) {
  const isDonate = mode === "donate";

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainBox}>
        <div className={styles.messageText}>
          {isDonate
            ? "OH! Looks like you haven't put anything up for donation!"
            : "OH! Looks like you haven't sold anything! Sell now!"}
        </div>

        <div className={styles.buttonContainer}>
          <Link
            href={
              isDonate
                ? "/listings/transactions/donate_piece"
                : "/listings/transactions/sell_piece"
            }
          >
            <button className={styles.sellButton}>
              {isDonate ? "Donate" : "Sell"}
            </button>
          </Link>
        </div>

        <img
          src={
            isDonate
              ? "/images/vintage-shop.jpeg"
              : "/images/sellpage.jpg"
          }
          className={styles.sellImage}
          alt={isDonate ? "Donate illustration" : "Sell illustration"}
        />
      </div>
    </div>
  );
}
