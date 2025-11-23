"use client"

import React, { useState } from "react"
import { ImageIcon, FileText, Music, Calendar, Tag, UserPlus, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

/** Redesigned version with an image lightbox & cleaner layout */
export function UnlockedCapsuleView({
  textContent,
  images = [],
  audioUrl,
  audios = [],
  createdDate,
  unlockDate,
  tags = [],
  shared = false,
  collaborators = [],
  allowContributors = false,
  previewImage,
  title,
  description,
  contentTypes = [],
}: any) {
  const created = new Date(createdDate)
  const unlocked = new Date(unlockDate)

  const audioSources = [ ...(Array.isArray(audios) ? audios : []), ...(audioUrl ? [audioUrl] : []) ]

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  return (
    <div className="space-y-6">

      {/** --- HEADER PREVIEW IMAGE --- */}
      {previewImage && (
        <Card className="p-0 overflow-hidden rounded-2xl shadow-md">
          <motion.div 
            className="relative w-full h-64"
            whileHover={{ scale: 1.01 }}
          >
            <Image
              src={previewImage}
              alt="Capsule preview"
              fill
              className="object-cover"
              unoptimized={previewImage.startsWith("data:") || previewImage.startsWith("blob:")}
            />
          </motion.div>
          {(title || description) && (
            <div className="p-4 bg-white/70 backdrop-blur-sm">
              {title && <h2 className="text-xl font-semibold">{title}</h2>}
              {description && <p className="text-sm opacity-80 mt-1">{description}</p>}
            </div>
          )}
        </Card>
      )}

      {/** --- METADATA SECTION --- */}
      <Card className="p-6 rounded-2xl shadow-sm bg-muted/20">
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Created:</span>
            <span className="font-medium">{created.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Unlocked:</span>
            <span className="font-medium">{unlocked.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Images:</span>
            <span className="font-medium">{images.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Audio files:</span>
            <span className="font-medium">{audioSources.length}</span>
          </div>
        </div>

        {contentTypes?.length > 0 && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {contentTypes.map((c: string) => (
              <Badge key={c} variant="secondary">{c}</Badge>
            ))}
          </div>
        )}
      </Card>

      {/** --- SHARED WITH --- */}
      {shared && collaborators.length > 0 && (
        <Card className="p-4 rounded-2xl shadow-sm bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Shared with{" "}
            {collaborators.map((c: string, idx: number) => {
              const display = c.includes("@") ? c : `@${c}`
              return (
                <span key={c}>
                  {display}
                  {idx < collaborators.length - 1 ? ", " : ""}
                </span>
              )
            })}
          </p>
        </Card>
      )}

      {/** --- TAGS --- */}
      {tags.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap justify-center text-center">
          <Tag className="w-4 h-4 opacity-70" />
          {tags.map((t: string) => (
            <Badge key={t} variant="secondary" className="px-3 py-1 rounded-full">
              {t}
            </Badge>
          ))}
        </div>
      )}

      {/** --- TEXT CONTENT --- */}
      {textContent && (
        <Card className="p-6 rounded-2xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Your Message</h3>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed">{textContent}</p>
        </Card>
      )}

      {/** --- IMAGES WITH LIGHTBOX --- */}
      {images.length > 0 && (
        <Card className="p-6 rounded-2xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Photos ({images.length})</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((src: string, index: number) => (
              <motion.div
                key={index}
                className="rounded-xl overflow-hidden relative cursor-pointer h-64"
                whileHover={{ scale: 1.02 }}
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={src}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized={src.startsWith("data:") || src.startsWith("blob:")}
                />
                <div className="absolute bottom-0 right-0 m-2 bg-white/80 text-xs px-2 py-1 rounded z-10">
                  #{index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/** --- AUDIO --- */}
      {audioSources.length > 0 && (
        <Card className="p-6 rounded-2xl shadow">
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Audio Message{audioSources.length > 1 ? "s" : ""}</h3>
          </div>

          <div className="flex flex-col gap-4">
            {audioSources.map((src: string, i: number) => (
              <div key={i} className="p-3 rounded-lg bg-muted/30">
                <div className="flex justify-between mb-2 text-sm">
                  <span>Audio #{i + 1}</span>
                  <a href={src} download className="hover:underline text-xs">Download</a>
                </div>
                <audio controls className="w-full">
                  <source src={src} />
                </audio>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/** --- FULLSCREEN LIGHTBOX MODAL --- */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="relative w-full h-full max-h-[80vh]">
                <Image
                  src={images[lightboxIndex]}
                  alt="Full screen preview"
                  fill
                  className="object-contain"
                  unoptimized={images[lightboxIndex].startsWith("data:") || images[lightboxIndex].startsWith("blob:")}
                />
              </div>

              <a
                href={images[lightboxIndex]}
                download
                className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded text-sm shadow hover:bg-white z-20"
              >
                Download
              </a>

              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}