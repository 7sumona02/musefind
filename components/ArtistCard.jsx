'use client'
import { HeartIcon, SpotifyLogoIcon } from '@phosphor-icons/react'
import Link from 'next/link'

export const ArtistCard = ({ artist, isFav, onFavToggle }) => (
  <div className='w-sm border-2 border-black p-1 flex flex-col space-y-3'>
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
          <div className='cursor-pointer' onClick={() => onFavToggle(artist.id)}>
            {isFav ? <HeartIcon size={20} weight='fill' /> : <HeartIcon size={20} />}
          </div>
        </div>
      </div>
    </div>
  </div>
)
