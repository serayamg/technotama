import { Metadata } from 'next';
import BcmNavPageClient from './BcmNavPageClient';

export const metadata: Metadata = {
  title: 'BCM NAV | Sistem Konsultan Business Continuity Management',
  description: 'Portal Login Sistem Konsultan BCM Navigator - ISO 22301:2019 & POJK 11/2022'
};

export default function BcmNavPage() {
  return <BcmNavPageClient />;
}
