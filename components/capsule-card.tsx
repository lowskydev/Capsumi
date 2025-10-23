import { Calendar, Lock, Unlock, ImageIcon, FileText, Music } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface CapsuleCardProps {
  id: string
  title: string
  unlockDate: Date
  createdDate: Date
  isLocked: boolean
  previewImage?: string
  contentTypes?: ("text" | "image" | "audio")[]
  tags?: string[]
}

export function CapsuleCard({
  id,
  title,
  unlockDate,
  createdDate,
  isLocked,
  previewImage,
  contentTypes = [], // default to empty array
  tags = [],
}: CapsuleCardProps) {
  const daysUntilUnlock = Math.ceil((unlockDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <Link href={`/capsule/${id}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer">
        {/* Preview Image or Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 overflow-hidden">
          {previewImage ? (
            <img src={previewImage} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl opacity-20">📦</div>
            </div>
          )}

          {/* Lock Status Overlay */}
          <div className="absolute top-3 right-3">
            <div
              className={`p-2 rounded-full backdrop-blur-sm ${
                isLocked ? "bg-primary/80 text-primary-foreground" : "bg-accent/80 text-accent-foreground"
              }`}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </div>
          </div>

          {/* Days Until Unlock Badge */}
          {isLocked && daysUntilUnlock > 0 && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                {daysUntilUnlock} days left
              </Badge>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-5">
          <h3 className="font-semibold text-lg mb-2 text-balance line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {/* Dates */}
          <div className="space-y-1 mb-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created {createdDate.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span className="font-medium">Opens {unlockDate.toLocaleDateString()}</span>
            </div>
          </div>

          {/* Content Type Icons */}
          <div className="flex items-center gap-2 mb-3">
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

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  )
}
