'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/ui/field"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"

export const Auth = () => {
  const [mode, setMode] = useState("login") 
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error
        toast.success("Signup successful! Check your email to verify your account.")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
        toast.success("Login successful!")
      }

      setEmail("")
      setPassword("")
    } catch (err) {
      toast.error(err.message || "Authentication failed")
    }
  }

  return (
    <div className='md:min-h-screen min-h-dvh w-screen flex justify-center font-mono text-neutral-900 py-15'>
    <div className="flex w-full max-w-sm flex-col gap-6">
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="login" onValueChange={setMode}>
          <TabsList className="w-full">
            <TabsTrigger value="login" className="w-1/2">Login</TabsTrigger>
            <TabsTrigger value="signup" className="w-1/2">Sign up</TabsTrigger>
          </TabsList>

          {/* Login */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login to your Account</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                <Field>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </Field>
                <Field>
                  <Input
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                </Field>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Login</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Signup */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create a new Account</CardTitle>
                <CardDescription>
                  Enter your details to sign up.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <Field>
                  <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                  />
                </Field>
                <Field>
                  <Input
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                  />
                </Field>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Sign up</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
    </div>
  )
}
