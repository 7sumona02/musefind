'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { toast } from 'sonner'
import { ArtistCard } from '@/components/ArtistCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const FavouritesPage = () => {
  const [artists, setArtists] = useState([])
  const [fav, setFav] = useState([])
  const [user, setUser] = useState(null)

  // Fetch logged-in user
  const fetchUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (data?.user) setUser(data.user)
  }

  // Fetch favourite artists (manual join)
  const fetchFavourites = async () => {
    if (!user) return

    // 1️⃣ Get favourite artist IDs for this user
    const { data: favRows, error: favError } = await supabase
      .from('favorites')
      .select('artist_id')
      .eq('user_id', user.id)

    if (favError) {
      toast.error(favError.message)
      return
    }

    const artistIds = favRows.map((f) => f.artist_id)

    // 2️⃣ Fetch artist details
    if (artistIds.length === 0) {
      setArtists([])
      setFav([])
      return
    }

    const { data: artistData, error: artistError } = await supabase
      .from('artists')
      .select('*')
      .in('id', artistIds)

    if (artistError) {
      toast.error(artistError.message)
      return
    }

    setArtists(artistData)
    setFav(artistIds)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (user) fetchFavourites()
  }, [user])

  // 🧠 Handle un-favourite
  const handleFavToggle = async (artistId) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('artist_id', artistId)
      .eq('user_id', user.id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Removed from favorites')
      setArtists(artists.filter((a) => a.id !== artistId))
      setFav(fav.filter((id) => id !== artistId))
    }
  }

  return (
    <div className='min-h-screen flex flex-col items-center font-mono font-medium pt-15 pb-10 text-neutral-900'>
      <div className='md:text-4xl text-3xl font-bold tracking-tight mb-5'>Your favourites.</div>

      {artists.length > 0 ? (
        <div className='space-y-5'>
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              isFav={fav.includes(artist.id)}
              onFavToggle={handleFavToggle}
            />
          ))}
        </div>
      ) : (
        <div className='text-neutral-500 pt-10'>No favourites yet.</div>
      )}
    </div>
  )
}

export default FavouritesPage
