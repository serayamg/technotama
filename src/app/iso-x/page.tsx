import { Metadata } from 'next';
import IsoXPageClient from './IsoXPageClient';

export const metadata: Metadata = {
  title: 'ISO-X | Sistem Konsultan Manajemen & Kepatuhan Enterprise',
  description: 'Portal Login Sistem Konsultan ISO-X - Integrated Management System, POJK & ISO 27001'
};

export default function IsoXPage() {
  return <IsoXPageClient />;
}
