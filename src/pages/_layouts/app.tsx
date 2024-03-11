import { Outlet } from 'react-router-dom'

import Header from '@/components/header'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="px-8 py-4">
        <Outlet />
      </div>
    </div>
  )
}
