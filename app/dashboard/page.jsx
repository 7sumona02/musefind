'use client'

import { useEffect, useState } from 'react'
import {Auth} from '@/components/Auth'
import { supabase } from '@/lib/supabase-client'
import AddArtist from '@/components/AddArtist'

const page = () => {
     const [session, setSession] = useState(null)

  const fetchSession = async () => {
     const currentSession = await supabase.auth.getSession()
     setSession(currentSession.data.session)
  }

  useEffect(() => {
    fetchSession()

    // const {data: {authListener}} = supabase.auth.onAuthStateChange((_event, session) => {
    //   setSession(session)
    // })

    // return () => {
    //   authListener.subscription.unsubscribe()
    // }
  },[])
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