'use client'

import {
  Field,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import {supabase} from '@/lib/supabase-client'
import { toast } from "sonner"
import {Button} from '@/components/ui/button'

const AddArtist = ({session}) => {
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

        const {error, data} = await supabase.from('artists').insert(artist)

        if (error) {
            toast.error(error.message)
            return
        }
        toast.success('Artist added successfully')
        console.log(data)
    }

     const logout = async () => {
     const {error} =await supabase.auth.signOut()
  
     if(error) {
      toast.error("Unable to logout")
      return
     }
  
     toast.success("You are logged out")
    }
    return (
        <div className='min-h-screen w-screen flex flex-col gap-5 items-center justify-center py-20 font-mono'>
            <div className="w-sm flex justify-between items-center">
                <div>Add Artist</div>
             <button onClick={logout} className="cursor-pointer text-black underline text-sm">Logout</button>
            </div>
            <div>
                <form onSubmit={handleSubmit} className="space-y-3 w-sm">
                    <Field>
                        <Input type="text" placeholder="Name" onChange={(e) => setArtist({...artist, name: e.target.value})} />
                    </Field>
                    <Field>
                        <Input type="text" placeholder="Genre" onChange={(e) => setArtist({...artist, genre: e.target.value})} />
                    </Field>
                    <Field>
                        <Textarea type="text" placeholder="Bio" onChange={(e) => setArtist({...artist, bio: e.target.value})} />
                    </Field>
                    <Field>
                        <Input type="text" placeholder="Spotify Link" onChange={(e) => setArtist({...artist, spotify: e.target.value})} />
                    </Field>
                    <Field>
                        <Input type="text" placeholder="Location" onChange={(e) => setArtist({...artist, location: e.target.value})} />
                    </Field>
                     <Field>
                        <Input type="text" placeholder="Image Url" onChange={(e) => setArtist({...artist, image: e.target.value})} />
                    </Field>
                    <Button className="w-full cursor-pointer" type="submit">Add Artist</Button>
                </form>
            </div>
        </div>
    )
}

export default AddArtist