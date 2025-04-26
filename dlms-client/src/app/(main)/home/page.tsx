'use client'

import UserDashboard from '@/components/pages/UserDashboard'
import LoginPage from '@/components/pages/LoginPage'
import { useAtom } from 'jotai'
import { isConnectedAtom } from '@/lib/atoms'

export default function Page() {
  const [isConnected] = useAtom(isConnectedAtom)

  return isConnected ? <UserDashboard /> : <LoginPage />
}