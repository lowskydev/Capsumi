"use client"

import React, { useMemo } from "react"
import { Lock, ImageIcon, FileText, Music, ArrowRight, Circle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import type { Capsule } from "@/lib/capsule-storage"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface Props {
  capsule: Capsule
  index: number
  isLast: boolean
}

export function TimelineItem({ capsule, index, isLast }: Props) {
  const unlockDate = useMemo(() => (capsule.unlockDate ? new Date(capsule.unlockDate) : null), [capsule.unlockDate])
  const eventDate = useMemo(() => (capsule.eventDate ? new Date(capsule.eventDate) : null), [capsule.eventDate])
  const now = useMemo(() => new Date(), [])

  const isLocked =
    typeof capsule.isLocked === "boolean"
      ? capsule.isLocked
      : unlockDate
      ? unlockDate > now
      : false

  const daysUntilUnlock = useMemo(() => {
    if (!unlockDate) return null
    const diffMs = unlockDate.getTime() - now.getTime()
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  }, [unlockDate, now])

  const contentTypes = capsule.contentTypes ?? []

  // Even index = Left side (on desktop), Odd index = Right side
  const isLeft = index % 2 === 0

  return (
    <div className={cn(
      "relative flex md:justify-between items-center w-full mb-12 md:mb-24", // Increased spacing for grandeur
      isLeft ? "md:flex-row" : "md:flex-row-reverse"
    )}>
      
      {/* --- DESKTOP CENTER SPINE --- */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-full flex-col items-center justify-center">
        {/* Animated Connection Line */}
        {!isLast && (
          <div className="absolute top-8 bottom-[-6rem] w-0.5 bg-gradient-to-b from-border via-border to-transparent z-0" />
        )}
        
        {/* The Center Node */}
        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, type: "spring" }}
          className={cn(
            "w-4 h-4 rounded-full border-4 z-10 shadow-sm transition-colors duration-500",
            isLocked 
              ? "bg-background border-red-400 dark:border-red-500" 
              : "bg-green-500 border-green-200 dark:border-green-900"
          )} 
        />
      </div>

      {/* --- CONTENT CARD CONTAINER --- */}
      <motion.div 
        initial={{ opacity: 0, x: isLeft ? -50 : 50, y: 20 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className={cn(
          "w-full md:w-[45%] pl-8 md:pl-0 relative", 
        )}
      >
        
        {/* Mobile: Vertical Line & Dot (Hidden on Desktop) */}
        <div className="md:hidden absolute left-[11px] top-8 bottom-[-3rem] w-0.5 bg-border" />
        <div className={cn(
          "md:hidden absolute left-0 top-8 w-6 h-6 rounded-full border-2 bg-background flex items-center justify-center z-10",
          isLocked ? "border-red-400" : "border-green-500"
        )}>
           <Circle className={cn("w-2 h-2 fill-current", isLocked ? "text-red-400" : "text-green-500")} />
        </div>

        {/* Date Label (Desktop Only - Floating) */}
        <div className={cn(
          "hidden md:block absolute top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground/60 tracking-wider uppercase",
          isLeft ? "right-[-125%] text-left pl-8" : "left-[-125%] text-right pr-8"
        )}>
           {eventDate ? eventDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : (unlockDate?.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }))}
        </div>

        {/* The Card */}
        <div
          className={cn(
            "relative bg-card rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 group hover:shadow-xl hover:-translate-y-1",
            isLocked ? "border-red-200/50 dark:border-red-900/30" : "border-green-200/50 dark:border-green-900/30"
          )}
        >
          {/* Card Header Image with Hover Zoom */}
          <div className="h-40 w-full relative bg-muted overflow-hidden">
             {capsule.previewImage ? (
                <>
                  <Image
                    src={capsule.previewImage}
                    alt="Preview"
                    fill
                    className={cn(
                      "object-cover transition-transform duration-700 ease-in-out group-hover:scale-110",
                      isLocked ? "blur-md grayscale scale-105" : ""
                    )}
                    unoptimized={capsule.previewImage.startsWith("data:")}
                  />
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                      <div className="bg-background/20 p-3 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
                </>
             ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/50 to-muted">
                   {isLocked ? <Lock className="w-10 h-10 text-muted-foreground/20" /> : <ImageIcon className="w-10 h-10 text-muted-foreground/20" />}
                </div>
             )}
             
             {/* Floating Badge */}
             <div className="absolute top-3 right-3">
                {isLocked ? (
                   <Badge variant="secondary" className="bg-black/60 text-white backdrop-blur-md border-0 shadow-lg font-medium">
                      {daysUntilUnlock} days left
                   </Badge>
                ) : (
                   <Badge variant="secondary" className="bg-green-500/90 text-white backdrop-blur-md border-0 shadow-lg font-medium">
                      Unlocked
                   </Badge>
                )}
             </div>
          </div>

          {/* Card Content */}
          <div className="p-5">
            <div className="mb-3">
              <h3 className="font-bold text-xl mb-1 line-clamp-1 text-foreground group-hover:text-primary transition-colors">
                {capsule.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed h-10">
                 {capsule.description || "No description provided."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border/50">
               <div className="flex gap-1.5">
                  {contentTypes.map(t => (
                     <div key={t} className="p-1.5 rounded-lg bg-secondary/10 text-secondary-foreground" title={t}>
                        {t === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
                        {t === 'text' && <FileText className="w-3.5 h-3.5" />}
                        {t === 'audio' && <Music className="w-3.5 h-3.5" />}
                     </div>
                  ))}
               </div>
               
               <Link href={`/capsule/${capsule.id}`}>
                  <Button size="sm" variant="ghost" className="h-8 px-3 text-xs font-semibold gap-1.5 rounded-full hover:bg-primary hover:text-primary-foreground transition-all group/btn">
                     Open <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </Button>
               </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}