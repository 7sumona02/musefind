'use client'

import { useEffect, useState } from 'react'
import {Auth} from '@/components/Auth'
import { supabase } from '@/lib/supabase-client'
import AddArtist from '@/components/AddArtist'

const page = () => {
 const [session, setSession] = useState(null)

  const fetchSession = async () => {
    const { data } = await supabase.auth.getSession()
    setSession(data.session)
  }

  useEffect(() => {
    fetchSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // ✅ Safely clean up even if undefined
    return () => {
      authListener?.subscription?.unsubscribe?.()
    }
  }, [])
  return (
     <div>
      {session ? 
        <AddArtist session={session} />
      : 
      <Auth />
      }
    </div>
  )
}

export default page