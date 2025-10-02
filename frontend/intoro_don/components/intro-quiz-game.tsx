"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Volume2, Play, RotateCcw, Trophy } from "lucide-react"

type Song = {
  id: number
  title: string
  artist: string
  audioUrl: string
  options: string[]
}

const songs: Song[] = [
  {
    id: 1,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    audioUrl: "/placeholder.mp3?song=bohemian-rhapsody",
    options: ["Bohemian Rhapsody", "We Will Rock You", "Don't Stop Me Now", "Somebody to Love"],
  },
  {
    id: 2,
    title: "Imagine",
    artist: "John Lennon",
    audioUrl: "/placeholder.mp3?song=imagine",
    options: ["Imagine", "Let It Be", "Hey Jude", "Yesterday"],
  },
  {
    id: 3,
    title: "Billie Jean",
    artist: "Michael Jackson",
    audioUrl: "/placeholder.mp3?song=billie-jean",
    options: ["Billie Jean", "Thriller", "Beat It", "Smooth Criminal"],
  },
  {
    id: 4,
    title: "Hotel California",
    artist: "Eagles",
    audioUrl: "/placeholder.mp3?song=hotel-california",
    options: ["Hotel California", "Take It Easy", "Desperado", "Life in the Fast Lane"],
  },
  {
    id: 5,
    title: "Sweet Child O' Mine",
    artist: "Guns N' Roses",
    audioUrl: "/placeholder.mp3?song=sweet-child",
    options: ["Sweet Child O' Mine", "November Rain", "Paradise City", "Welcome to the Jungle"],
  },
]

export default function IntroQuizGame() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentSong = songs[currentSongIndex]
  const progress = ((currentSongIndex + 1) / songs.length) * 100

  useEffect(() => {
    if (gameStarted && !gameFinished) {
      audioRef.current = new Audio(currentSong.audioUrl)
      audioRef.current.addEventListener("ended", () => setIsPlaying(false))

      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [currentSongIndex, gameStarted, gameFinished, currentSong.audioUrl])

  const playIntro = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleAnswer = (answer: string) => {
    if (isAnswered) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    if (answer === currentSong.title) {
      setScore(score + 1)
    }

    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const handleNext = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setIsPlaying(false)
    } else {
      setGameFinished(true)
    }
  }

  const resetGame = () => {
    setCurrentSongIndex(0)
    setScore(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setGameStarted(false)
    setGameFinished(false)
    setIsPlaying(false)
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12 text-center space-y-6 bg-card/95 backdrop-blur">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <Volume2 className="w-10 h-10 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-balance">イントロクイズ</h1>
            <p className="text-lg text-muted-foreground text-balance">
              曲のイントロを聴いて、正しい曲名を当てましょう！
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="font-semibold text-foreground">問題数</div>
                <div className="text-2xl font-bold text-primary">{songs.length}曲</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="font-semibold text-foreground">選択肢</div>
                <div className="text-2xl font-bold text-secondary">4つ</div>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="font-semibold text-foreground">制限時間</div>
                <div className="text-2xl font-bold text-accent">なし</div>
              </div>
            </div>

            <Button size="lg" className="w-full text-lg h-14" onClick={() => setGameStarted(true)}>
              <Play className="w-5 h-5 mr-2" />
              ゲームスタート
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (gameFinished) {
    const percentage = Math.round((score / songs.length) * 100)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-4">
        <Card className="max-w-2xl w-full p-8 md:p-12 text-center space-y-6 bg-card/95 backdrop-blur">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-accent" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-balance">ゲーム終了！</h2>
            <p className="text-lg text-muted-foreground">お疲れ様でした</p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="p-8 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
              <div className="text-sm font-semibold text-muted-foreground mb-2">あなたのスコア</div>
              <div className="text-6xl font-bold text-primary mb-2">
                {score} / {songs.length}
              </div>
              <div className="text-2xl font-semibold text-accent">{percentage}%</div>
            </div>

            <div className="space-y-2">
              {percentage === 100 && <p className="text-lg font-semibold text-accent">🎉 パーフェクト！素晴らしい！</p>}
              {percentage >= 80 && percentage < 100 && (
                <p className="text-lg font-semibold text-secondary">🎵 すごい！音楽通ですね！</p>
              )}
              {percentage >= 60 && percentage < 80 && (
                <p className="text-lg font-semibold text-primary">👍 なかなか良い成績です！</p>
              )}
              {percentage < 60 && (
                <p className="text-lg font-semibold text-muted-foreground">💪 もう一度チャレンジしてみましょう！</p>
              )}
            </div>

            <Button size="lg" className="w-full text-lg h-14" onClick={resetGame}>
              <RotateCcw className="w-5 h-5 mr-2" />
              もう一度プレイ
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 p-4">
      <Card className="max-w-3xl w-full p-6 md:p-8 space-y-6 bg-card/95 backdrop-blur">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-muted-foreground">
              問題 {currentSongIndex + 1} / {songs.length}
            </div>
            <div className="text-sm font-semibold">
              スコア: <span className="text-primary text-lg">{score}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-4 py-8">
            <h2 className="text-2xl md:text-3xl font-bold text-balance">この曲のタイトルは？</h2>

            <Button
              size="lg"
              variant={isPlaying ? "secondary" : "default"}
              className="w-48 h-48 rounded-full text-lg"
              onClick={playIntro}
              disabled={isAnswered}
            >
              <div className="flex flex-col items-center gap-3">
                {isPlaying ? (
                  <>
                    <Volume2 className="w-16 h-16 animate-pulse" />
                    <span>再生中...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-16 h-16" />
                    <span>イントロを聴く</span>
                  </>
                )}
              </div>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentSong.options.map((option) => {
              const isCorrect = option === currentSong.title
              const isSelected = option === selectedAnswer

              let buttonVariant: "default" | "outline" | "secondary" | "destructive" = "outline"
              let buttonClass = ""

              if (isAnswered) {
                if (isCorrect) {
                  buttonVariant = "default"
                  buttonClass = "bg-primary text-primary-foreground border-primary"
                } else if (isSelected && !isCorrect) {
                  buttonVariant = "destructive"
                }
              }

              return (
                <Button
                  key={option}
                  variant={buttonVariant}
                  size="lg"
                  className={`h-auto py-4 text-lg font-semibold transition-all ${buttonClass}`}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered}
                >
                  {option}
                  {isAnswered && isCorrect && <span className="ml-2">✓</span>}
                  {isAnswered && isSelected && !isCorrect && <span className="ml-2">✗</span>}
                </Button>
              )
            })}
          </div>

          {isAnswered && (
            <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div
                className={`p-4 rounded-lg text-center ${
                  selectedAnswer === currentSong.title
                    ? "bg-primary/10 border-2 border-primary/20"
                    : "bg-destructive/10 border-2 border-destructive/20"
                }`}
              >
                <p className="text-lg font-semibold mb-2">
                  {selectedAnswer === currentSong.title ? "🎉 正解！" : "😢 不正解..."}
                </p>
                <p className="text-sm text-muted-foreground">
                  正解: <span className="font-bold text-foreground">{currentSong.title}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  アーティスト: <span className="font-semibold text-foreground">{currentSong.artist}</span>
                </p>
              </div>

              <Button size="lg" className="w-full text-lg h-12" onClick={handleNext}>
                {currentSongIndex < songs.length - 1 ? "次の問題へ" : "結果を見る"}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
