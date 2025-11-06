'use client'
import { HeartIcon, SpotifyLogoIcon } from '@phosphor-icons/react'
import Link from 'next/link'

export const ArtistCard = ({ artist, isFav, onFavToggle }) => (
  <div className='md:w-sm w-xs border border-neutral-200 p-1 flex flex-col space-y-3 bg-neutral-800'>
    <div className='w-full flex justify-between gap-2'>
      <div className='w-30 aspect-square overflow-hidden'>
        <img src={artist.image} className='w-full h-full object-cover' alt={artist.name} />
      </div>
      <div className='w-full flex flex-col justify-between p-1'>
        <div className='w-full flex justify-between items-start details'>
          <div className='text-neutral-200'>
            <div className='font-bold'>{artist.name}</div>
            <div className='text-sm'>{artist.location}</div>
          </div>
          <div className='cursor-pointer'>
            <Link href={artist.spotify} target='_blank'>
              <SpotifyLogoIcon size={25} weight='fill' className='text-neutral-200' />
            </Link>
          </div>
        </div>
        <div className='w-full flex justify-between items-center'>
          <div className='text-xs text-neutral-300'>{artist.genre}</div>
          <div className='cursor-pointer m-0.5 text-neutral-200' onClick={() => onFavToggle(artist.id)}>
            {isFav ? <HeartIcon size={20} weight='fill' /> : <HeartIcon size={20} />}
          </div>
        </div>
      </div>
    </div>
  </div>
)
