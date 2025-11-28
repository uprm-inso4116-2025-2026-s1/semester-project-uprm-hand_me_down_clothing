import Link from 'next/link';
import React, { FC } from 'react'; 
import styles from '../marketplace.module.css';

import SharedMarketplacePage from "../SharedMarketplacePage";

export default function SellPage() {
  return <SharedMarketplacePage mode="sell" />;
}
