import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { DatePickerSimple } from "@/components/date-picker"
import { Calendar as CalendarIcon, RotateCcw } from "lucide-react"

const WEEKS_PER_YEAR = 52
const DEFAULT_LIFE_EXPECTANCY = 80

interface LifeStats {
  weeksLived: number
  weeksRemaining: number
  yearsLived: number
  yearsRemaining: number
  percentageLived: number
}

function calculateLifeStats(
  birthDate: Date,
  lifeExpectancy: number
): LifeStats {
  const now = new Date()
  const diffTime = now.getTime() - birthDate.getTime()
  const weeksLived = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
  const yearsLived = weeksLived / WEEKS_PER_YEAR
  const totalWeeks = lifeExpectancy * WEEKS_PER_YEAR
  const weeksRemaining = Math.max(0, totalWeeks - weeksLived)
  const yearsRemaining = Math.max(0, lifeExpectancy - yearsLived)
  const percentageLived = Math.min(100, (weeksLived / totalWeeks) * 100)

  return {
    weeksLived,
    weeksRemaining,
    yearsLived: Math.floor(yearsLived),
    yearsRemaining: Math.floor(yearsRemaining),
    percentageLived,
  }
}

function formatNumber(num: number): string {
  return num.toLocaleString()
}

export function App() {
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(DEFAULT_LIFE_EXPECTANCY)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const lifeStats = useMemo(() => {
    if (!birthDate || !isSubmitted) return null
    return calculateLifeStats(birthDate, lifeExpectancy)
  }, [birthDate, lifeExpectancy, isSubmitted])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (birthDate) {
      setIsSubmitted(true)
    }
  }

  const handleReset = () => {
    setIsSubmitted(false)
    setBirthDate(undefined)
    setLifeExpectancy(DEFAULT_LIFE_EXPECTANCY)
  }

  const totalWeeks = lifeExpectancy * WEEKS_PER_YEAR

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Memento Mori
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A visual reminder of life's finite nature. Each dot represents one week of your life.
            Filled dots are in the past, empty dots are what remains.
          </p>
        </div>

        {/* Input Form */}
        <Card className="mx-auto mb-8 max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Your Information
            </CardTitle>
            <CardDescription>
              Enter your birth date and expected lifespan to generate your calendar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <DatePickerSimple date={birthDate} onDateChange={setBirthDate} />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lifeExpectancy">Life Expectancy</Label>
                  <span className="text-sm font-medium">{lifeExpectancy} years</span>
                </div>
                <Slider
                  id="lifeExpectancy"
                  value={[lifeExpectancy]}
                  onValueChange={(value) => setLifeExpectancy(value[0])}
                  min={30}
                  max={120}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="flex-1" disabled={!birthDate}>
                  Generate Calendar
                </Button>
                {isSubmitted && (
                  <Button type="button" variant="outline" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {isSubmitted && lifeStats && (
          <>
            {/* Stats Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Years Lived</CardDescription>
                  <CardTitle className="text-3xl text-primary">
                    {lifeStats.yearsLived}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Weeks Lived</CardDescription>
                  <CardTitle className="text-3xl text-primary">
                    {formatNumber(lifeStats.weeksLived)}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Years Remaining</CardDescription>
                  <CardTitle className="text-3xl text-primary">
                    {lifeStats.yearsRemaining}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Life Progress</CardDescription>
                  <CardTitle className="text-3xl">
                    {lifeStats.percentageLived.toFixed(1)}%
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Calendar Grid */}
            <Card className="overflow-hidden">
              <CardContent className="flex flex-col items-center gap-8">
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm border border-primary bg-primary" />
                    <span>Lived</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm border border-red-500 bg-red-500" />
                    <span>Current Week</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm border border-muted-foreground/30 bg-muted" />
                    <span>Remaining</span>
                  </div>
                </div>
                <div
                  className="grid gap-1 justify-center"
                  style={{
                    gridTemplateColumns: 'repeat(auto-fill, 12px)',
                    width: '100%',
                    maxWidth: '900px'
                  }}
                >
                  {Array.from({ length: totalWeeks }).map((_, index) => {
                    const isLived = index < lifeStats.weeksLived
                    const isCurrentWeek = index === lifeStats.weeksLived

                    return (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-sm border transition-all duration-200 hover:scale-125 ${
                          isLived
                            ? 'bg-primary border-primary'
                            : isCurrentWeek
                            ? 'bg-red-500 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                            : 'bg-muted border-muted-foreground/30'
                        }`}
                        title={`Week ${index + 1}`}
                      />
                    )
                  })}
                </div>

           
              </CardContent>
            </Card>

            {/* Footer Message */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
              <p>
                "Let us prepare our minds as if we'd come to the very end of life.
                Let us postpone nothing. Let us balance life's books each day."
                — Seneca
              </p>
            </div>

            {/* Footer */}
            <footer className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
              <a
                href="https://x.com/techbymave"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-current"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.733-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Follow me
              </a>
            </footer>
          </>
        )}


      </div>
    </div>
  )
}

export default App
