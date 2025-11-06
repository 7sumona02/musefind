'use client'

import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { supabase } from '@/lib/supabase-client'
import { toast } from "sonner"
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { SpotifyLogoIcon } from "@phosphor-icons/react"
import { EditIcon, Trash } from "lucide-react"

const AddArtist = ({ session }) => {
    const [artist, setArtist] = useState({
        name: '',
        genre: '',
        bio: '',
        spotify: '',
        location: '',
        image: ''
    })

    const [artists, setArtists] = useState([])
    const [editId, setEditId] = useState(null) // track which artist is being edited

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!artist.name.trim()) {
            toast.error("Name is required")
            return
        }

        if (editId) {
            // update existing artist
            const { error } = await supabase
                .from('artists')
                .update({
                    ...artist
                })
                .eq('id', editId)

            if (error) {
                toast.error(error.message)
                return
            }
            toast.success('Artist updated successfully')
            setEditId(null)
        } else {
            // add new artist
            const { error } = await supabase
                .from('artists')
                .insert({ ...artist, email: session.user.email })

            if (error) {
                toast.error(error.message)
                return
            }
            toast.success('Artist added successfully')
        }

        setArtist({
            name: '',
            genre: '',
            bio: '',
            spotify: '',
            location: '',
            image: ''
        })
        fetchArtists()
    }

    const deleteArtist = async (id) => {
        const { error } = await supabase.from('artists').delete().eq('id', id)
        if (error) {
            toast.error(error.message)
            return
        }
        toast.success('Artist deleted successfully')
        fetchArtists()
    }

    const editArtist = (artist) => {
        setArtist({
            name: artist.name,
            genre: artist.genre,
            bio: artist.bio,
            spotify: artist.spotify,
            location: artist.location,
            image: artist.image
        })
        setEditId(artist.id)
        toast.info('Editing artist details')
    }

    const logout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            toast.error("Unable to logout")
            return
        }
        toast.success("You are logged out")
    }

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
                    const newArtist = payload.new
                    setArtists((prev) => [...prev, newArtist])
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div className='md:min-h-screen min-h-dvh w-screen flex flex-col gap-5 items-center py-15 font-mono'>
            <div className="w-sm flex justify-between items-center font-bold">
                <div>{editId ? "Edit Artist" : "Add Artist"}</div>
                <button onClick={logout} className='cursor-pointer text-xs border border-neutral-900 rounded-full px-3 py-1 font-bold'>Logout</button>
            </div>

            <div>
                <form onSubmit={handleSubmit} className="space-y-3 w-sm">
                    <Field>
                        <Input type="text" placeholder="Name" value={artist.name} onChange={(e) => setArtist({ ...artist, name: e.target.value })} />
                    </Field>
                    <Field>
                        <Input type="text" placeholder="Genre" value={artist.genre} onChange={(e) => setArtist({ ...artist, genre: e.target.value })} />
                    </Field>
                    <Field>
                        <Textarea placeholder="Bio" value={artist.bio} onChange={(e) => setArtist({ ...artist, bio: e.target.value })} />
                    </Field>
                    <Field>
                        <Input type="text" placeholder="Spotify Link" value={artist.spotify} onChange={(e) => setArtist({ ...artist, spotify: e.target.value })} />
                    </Field>
                    <Field>
                        <Input type="text" placeholder="Location" value={artist.location} onChange={(e) => setArtist({ ...artist, location: e.target.value })} />
                    </Field>
                    <Field>
                        <Input type="text" placeholder="Image URL" value={artist.image} onChange={(e) => setArtist({ ...artist, image: e.target.value })} />
                    </Field>
                    <Button className="w-full cursor-pointer" type="submit">
                        {editId ? "Update Artist" : "Add Artist"}
                    </Button>
                </form>
            </div>

            <div className="space-y-10 mt-5">
                {artists.map((artist, key) => (
                    <div key={key}>
                        <div className='w-sm border border-neutral-200 p-1 flex flex-col space-y-3 bg-neutral-800'>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 mt-3">
                            <EditIcon
                                onClick={() => editArtist(artist)}
                                className="text-black size-5 cursor-pointer"
                            />
                            <Trash
                                onClick={() => deleteArtist(artist.id)}
                                className="text-red-500 size-5 cursor-pointer"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AddArtist
