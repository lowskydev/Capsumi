import { Calendar, Lock, Unlock, ImageIcon, FileText, Music, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TimelineItemProps {
  id: string
  title: string
  unlockDate: Date
  createdDate: Date
  isLocked: boolean
  previewImage?: string
  contentTypes: readonly ("text" | "image" | "audio")[]
  tags?: string[]
  description?: string
}

export function TimelineItem({
  id,
  title,
  unlockDate,
  createdDate,
  isLocked,
  previewImage,
  contentTypes,
  tags = [],
  description,
}: TimelineItemProps) {
  const daysUntilUnlock = Math.ceil((unlockDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="relative pl-8 pb-12 group">
      {/* Timeline Line */}
      <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-border group-last:hidden" />

      {/* Timeline Dot */}
      <div
        className={`absolute left-0 top-2 w-8 h-8 rounded-full border-4 border-background flex items-center justify-center ${
          isLocked ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
        }`}
      >
        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
      </div>

      {/* Content Card */}
      <div className="bg-card rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md">
        <div className="flex flex-col md:flex-row">
          {/* Preview Image */}
          {previewImage && (
            <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex-shrink-0">
              <img src={previewImage || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-1 text-balance">{title}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created {createdDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Opens {unlockDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              {isLocked && daysUntilUnlock > 0 && (
                <Badge variant="secondary" className="ml-4">
                  {daysUntilUnlock} days left
                </Badge>
              )}
              {!isLocked && (
                <Badge variant="outline" className="ml-4 bg-accent/10 text-accent-foreground border-accent/20">
                  Unlocked
                </Badge>
              )}
            </div>

            {/* Description */}
            {description && <p className="text-muted-foreground mb-4 line-clamp-2 text-pretty">{description}</p>}

            {/* Content Types & Tags */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                {contentTypes.includes("text") && (
                  <div className="p-1.5 rounded-lg bg-muted">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
                {contentTypes.includes("image") && (
                  <div className="p-1.5 rounded-lg bg-muted">
                    <ImageIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
                {contentTypes.includes("audio") && (
                  <div className="p-1.5 rounded-lg bg-muted">
                    <Music className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                )}
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{tags.length - 4}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* View Button */}
            <Link href={`/capsule/${id}`}>
              <Button variant="outline" className="gap-2 bg-transparent">
                View Capsule
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
