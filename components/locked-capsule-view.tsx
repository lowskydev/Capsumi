import { Lock, Calendar, Clock } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LockedCapsuleViewProps {
  unlockDate: Date
  previewImage?: string
}

export function LockedCapsuleView({ unlockDate, previewImage }: LockedCapsuleViewProps) {
  const now = new Date()
  const timeUntilUnlock = unlockDate.getTime() - now.getTime()
  const daysUntilUnlock = Math.ceil(timeUntilUnlock / (1000 * 60 * 60 * 24))
  const hoursUntilUnlock = Math.ceil(timeUntilUnlock / (1000 * 60 * 60))

  return (
    <Card className="p-8 md:p-12 text-center">
      <div className="max-w-2xl mx-auto">
        {/* Lock Icon */}
        <div className="mb-6 flex justify-center">
          <div className="p-6 rounded-full bg-primary/10">
            <Lock className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Preview Image (Blurred) */}
        {previewImage && (
          <div className="mb-6 relative rounded-2xl overflow-hidden">
            <img
              src={previewImage || "/placeholder.svg"}
              alt="Capsule preview"
              className="w-full h-64 object-cover blur-lg"
            />
            <div className="absolute inset-0 bg-background/40 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Preview Hidden
              </Badge>
            </div>
          </div>
        )}

        {/* Locked Message */}
        <h2 className="text-3xl font-bold mb-3 text-balance">This Capsule is Locked</h2>
        <p className="text-muted-foreground text-lg mb-8 text-pretty">
          Your memories are safely preserved and will be revealed when the time comes
        </p>

        {/* Countdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="p-6 bg-muted/50">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{daysUntilUnlock}</div>
            <div className="text-sm text-muted-foreground">Days Until Unlock</div>
          </Card>
          <Card className="p-6 bg-muted/50">
            <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-3xl font-bold mb-1">{hoursUntilUnlock}</div>
            <div className="text-sm text-muted-foreground">Hours Until Unlock</div>
          </Card>
        </div>

        {/* Unlock Date */}
        <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
          <div className="text-sm text-muted-foreground mb-1">Unlocks on</div>
          <div className="text-2xl font-semibold text-primary">
            {unlockDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
