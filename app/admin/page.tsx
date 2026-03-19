import { cookies } from 'next/headers'
import AdminClientLayout from './AdminClientLayout'
import { getPaquetes } from '@/lib/airtable'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = cookies()
  const hasSession = cookieStore.get('admin_session')?.value === 'true'
  const paquetes = await getPaquetes()

  return <AdminClientLayout hasSession={hasSession} paquetes={paquetes} />
}
