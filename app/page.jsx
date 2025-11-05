'use client'

import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { supabase } from '@/lib/supabase-client'
import { HeartIcon, SpotifyLogoIcon } from '@phosphor-icons/react'
import { SearchIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const Page = () => {
  const [artists, setArtists] = useState([])
  const [search, setSearch] = useState('')
  const [fav, setFav] = useState([]) // store list of artist IDs user has favorited
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

  const fetchFavorites = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('favorites')
      .select('artist_id')
      .eq('user_id', user.id)

    if (error) {
      toast.error(error.message)
      return
    }

    setFav(data.map((f) => f.artist_id))
  }

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchArtists()
      fetchFavorites()
    }
  }, [user])

  const handleFavToggle = async (artistId) => {
    if (!user) {
      toast.error('Please log in to save favorites')
      return
    }

    const isFav = fav.includes(artistId)

    if (isFav) {
      // remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('artist_id', artistId)
        .eq('user_id', user.id)

      if (error) {
        toast.error(error.message)
      } else {
        setFav(fav.filter((id) => id !== artistId))
        toast.success('Removed from favorites')
      }
    } else {
      // add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert([{ artist_id: artistId, user_id: user.id }])

      if (error) {
        toast.error(error.message)
      } else {
        setFav([...fav, artistId])
        toast.success('Added to favorites')
      }
    }
  }

  const filteredArtists = artists.filter((artist) =>
    [artist.name, artist.genre, artist.location]
      .some((field) => field?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className='md:min-h-screen min-h-dvh flex flex-col items-center font-mono font-medium py-10'>
      <Link href='/dashboard'><Button className='mb-5 cursor-pointer'>Add artist</Button></Link>
      <div className='md:text-4xl text-3xl font-bold tracking-tight'>Find your muse.</div>

      <div className='pt-5'>
        <InputGroup className='w-sm'>
          <InputGroupInput
            placeholder="Search your muse"
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
            <div key={artist.id} className='w-sm border-2 border-black p-1 flex flex-col space-y-3'>
              <div className='w-full flex justify-between gap-3'>
                <div className='w-28 aspect-square overflow-hidden'>
                  <img src={artist.image} className='w-full h-full object-cover' alt={artist.name} />
                </div>
                <div className='w-full flex flex-col justify-between'>
                  <div className='w-full flex justify-between items-start details'>
                    <div>
                      <div className='font-bold text-lg'>{artist.name}</div>
                      <div className='text-sm'>{artist.location}</div>
                    </div>
                    <div className='cursor-pointer'>
                      <Link href={artist.spotify} target='_blank'>
                        <SpotifyLogoIcon size={25} weight='fill' />
                      </Link>
                    </div>
                  </div>
                  <div className='w-full flex justify-between items-center'>
                    <div className='text-sm text-neutral-500'>{artist.genre}</div>
                    <div
                      className='cursor-pointer'
                      onClick={() => handleFavToggle(artist.id)}
                    >
                      {fav.includes(artist.id)
                        ? <HeartIcon size={20} weight='fill' />
                        : <HeartIcon size={20} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-neutral-500 pt-10'>No artists found.</div>
        )}
      </div>
    </div>
  )
}

export default Page
