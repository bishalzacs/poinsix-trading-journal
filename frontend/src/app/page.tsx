import { redirect } from 'next/navigation'

export default function Home() {
  // Our middleware already handles checking auth status.
  // We can safely redirect to the dashboard.
  redirect('/dashboard')
}
