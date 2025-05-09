"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Star, TrendingUp, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28 lg:py-32 flex justify-center items-center">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-0" />

      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px] z-0" />

      {/* Floating elements */}
      <div className="absolute top-20 left-[15%] w-16 h-16 rounded-lg bg-primary/10 border border-primary/20 shadow-sm rotate-12 animate-float-slow opacity-70 hidden md:block" />
      <div className="absolute bottom-32 right-[15%] w-20 h-20 rounded-lg bg-secondary/10 border border-secondary/20 shadow-sm -rotate-6 animate-float opacity-70 hidden md:block" />
      <div className="absolute top-40 right-[20%] w-12 h-12 rounded-full bg-muted flex items-center justify-center animate-float-slow hidden md:block">
        <CheckCircle className="w-6 h-6 text-primary/70" />
      </div>
      <div className="absolute bottom-40 left-[20%] w-12 h-12 rounded-full bg-muted flex items-center justify-center animate-float hidden md:block">
        <Clock className="w-6 h-6 text-primary/70" />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="px-4 py-1 text-sm">
              <Star className="mr-1 h-3.5 w-3.5" />
              <span>Intuitive Design</span>
            </Badge>
            <Badge variant="secondary" className="px-4 py-1 text-sm">
              <TrendingUp className="mr-1 h-3.5 w-3.5" />
              <span>Boost Productivity</span>
            </Badge>
          </div>

          {/* Main heading with animation */}
          <div
            className={`space-y-4 max-w-3xl transition-all duration-1000 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Manage tasks
              </span>{" "}
              with clarity and ease
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl mx-auto max-w-2xl">
              Streamline your workflow, boost productivity, and never miss a deadline again with our intuitive task
              management solution.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 py-6">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">98%</span>
              <span className="text-sm text-muted-foreground">Task Completion</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">10k+</span>
              <span className="text-sm text-muted-foreground">Active Users</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-primary">30%</span>
              <span className="text-sm text-muted-foreground">Time Saved</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div
            className={`flex flex-col gap-3 min-[400px]:flex-row pt-4 transition-all duration-1000 delay-300 ease-out ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
            }`}
          >
            <Button asChild size="lg" className="px-8 rounded-full">
              <Link href="/login">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 rounded-full">
              <Link href="/login">Login</Link>
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-1">Scroll to explore</span>
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  )
}
