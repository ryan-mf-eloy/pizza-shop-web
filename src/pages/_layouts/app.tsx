import { Outlet } from 'react-router-dom'

import Header from '@/components/header'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="p-8">
        <Outlet />
      </div>
    </div>
  )
}
