import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Menu from './Menu'
import ThemeRegistry from './_theme/ThemeRegistry'
import { getAuth } from "firebase/auth";
const inter = Inter({ subsets: ['latin'] })
import app from "@/app/_firebase/Config";
import { AuthContextProvider } from './AuthContext'
const auth = getAuth(app);
export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
    <body className={inter.className}>
      <ThemeRegistry>
        <AuthContextProvider>
          <Menu />
          {children}
        </AuthContextProvider>
      </ThemeRegistry>
    </body>
  </html>
  )
}