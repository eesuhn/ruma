'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, CheckCircle } from "lucide-react"

export function GuestCheckIn() {
  const [isScanning, setIsScanning] = useState(false)
  const [lastCheckedIn, setLastCheckedIn] = useState<string | null>(null)

  const handleScan = () => {
    // Simulating a QR scan
    setIsScanning(true)
    setTimeout(() => {
      const guestName = "John Doe" // This would be the result of the QR scan
      setLastCheckedIn(guestName)
      setIsScanning(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Guest Check-In</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Button
          onClick={handleScan}
          disabled={isScanning}
          size="lg"
          className="w-full max-w-xs"
        >
          {isScanning ? (
            "Scanning..."
          ) : (
            <>
              <QrCode className="mr-2 h-5 w-5" /> Scan QR Code
            </>
          )}
        </Button>
        {lastCheckedIn && (
          <div className="flex items-center text-green-600">
            <CheckCircle className="mr-2 h-5 w-5" />
            <span>{lastCheckedIn} checked in successfully!</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
