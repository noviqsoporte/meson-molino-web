import { cookies } from 'next/headers'
import AdminClientLayout from './AdminClientLayout'

export const dynamic = 'force-dynamic'

export default function AdminPage() {
  const cookieStore = cookies()
  const hasSession = cookieStore.get('admin_session')?.value === 'true'

  return <AdminClientLayout hasSession={hasSession} />
}
