// app/users/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type User = {
  id: string
  username: string
  xp: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('*')
      if (error) {
        console.error('Error fetching users:', error)
      } else {
        setUsers(data as User[])
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Player List</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user.id} className="p-3 bg-gray-100 rounded shadow">
              <strong>{user.username}</strong> — XP: {user.xp}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
