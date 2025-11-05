'use client'

import {
    Field,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { supabase } from '@/lib/supabase-client'
import { toast } from "sonner"
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { SpotifyLogoIcon } from "@phosphor-icons/react"

const AddArtist = ({ session }) => {
    const [artist, setArtist] = useState({
        name: '',
        genre: '',
        bio: '',
        spotify: '',
        location: '',
        image: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { error, data } = await supabase.from('artists').insert({ ...artist, email: session.user.email })

        if (error) {
            toast.error(error.message)
            return
        }
        toast.success('Artist added successfully')
        console.log(data)
    }

    

    const logout = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            toast.error("Unable to logout")
            return
        }

        toast.success("You are logged out")
    }

    const [artists, setArtists] = useState([])

    const fetchArtists = async () => {
        const { error, data } = await supabase
            .from('artists')
            .select('*')
            .eq('email', session.user.email)
            .order('name', { ascending: true })

        if (error) {
            toast.error(error.message)
            return
        }
        setArtists(data)
    }

    useEffect(() => {
        fetchArtists()
    }, [])

    useEffect(() => {
        const channel = supabase
            .channel('artists-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'artists' },
                (payload) => {
                    const artists = payload.new
                    setArtists((prev) => [...prev, artists])
                }
            )

        // subscribe returns a promise
        channel.subscribe((status) => {
            if (status === 'SUBSCRIBED') {
                console.log('Subscribed!')
            }
        })

        // cleanup on unmount
        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div className='min-h-screen w-screen flex flex-col gap-5 items-center justify-center py-20 font-mono'>
            <div className="w-sm flex justify-between items-center">
                <div>Add Artist</div>
                <button onClick={logout} className="cursor-pointer text-black underline text-sm">Logout</button>
            </div>
            <div>
                <form onSubmit={handleSubmit} className="space-y-3 w-sm">
                    <Field>
                        <Input type="text" placeholder="Name" onChange={(e) => setArtist({ ...artist, name: e.target.value })} />
                    </Field>
                    <Field>
                        <Input type="text" placeholder="Genre" onChange={(e) => setArtist({ ...artist, genre: e.target.value })} />
                    </Field>
                    <Field>
                        <Textarea type="text" placeholder="Bio" onChange={(e) => setArtist({ ...artist, bio: e.target.value })} />
                    </Field>
                    <Field>
                        <Input type="text" placeholder="Spotify Link" onChange={(e) => setArtist({ ...artist, spotify: e.target.value })} />
                    </Field>
                    <Field>
                        <Input type="text" placeholder="Location" onChange={(e) => setArtist({ ...artist, location: e.target.value })} />
                    </Field>
                    <Field>
                        <Input type="text" placeholder="Image Url" onChange={(e) => setArtist({ ...artist, image: e.target.value })} />
                    </Field>
                    <Button className="w-full cursor-pointer" type="submit">Add Artist</Button>
                </form>
            </div>

            <div className="space-y-5 mt-5">
                {artists.map((artist, key) => (
                    <div key={key} className='w-sm border-2 border-black p-1 flex flex-col space-y-3'>
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
                                <div className='text-sm text-neutral-500'>{artist.genre}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AddArtist