'use client'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { supabase } from '@/lib/supabase-client'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {ArtistCard} from '@/components/ArtistCard'

const Page = () => {
  const [artists, setArtists] = useState([])
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)

  // Fetch user session
  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (data?.user) setUser(data.user)
  }

  const fetchArtists = async () => {
    const { error, data } = await supabase
      .from('artists')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      toast.error(error.message)
      return
    }
    setArtists(data)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchArtists()
    }
  }, [user])

  const filteredArtists = artists.filter((artist) =>
    [artist.name, artist.genre, artist.location]
      .some((field) => field?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className='md:min-h-screen min-h-dvh flex flex-col items-center font-mono font-medium pt-15 text-neutral-900'>
      <div className='md:text-4xl text-3xl font-bold tracking-tight'>Find your muse</div>

      <div className='pt-5'>
        <InputGroup className='w-xs md:w-sm shadow-none'>
          <InputGroupInput
            placeholder="Search artist, genre..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className='space-y-5 mt-15'>
        {filteredArtists.length > 0 ? (
          filteredArtists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
            />
          ))
        ) : (
          <div className='text-neutral-500 pt-10'>No artists found.</div>
        )}
      </div>
    </div>
  )
}

export default Page
