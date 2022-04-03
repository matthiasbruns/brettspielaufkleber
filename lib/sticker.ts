import { createCanvas } from 'canvas'
import { type } from 'os'
import internal from 'stream'


type PlayersRange = {
    minPlayers: number;
    maxPlayers: number;
}

type PlayerStickerData = {
    playersRangeOfficial: PlayersRange;
    playersRangeCommunity: PlayersRange;
}

type StickerData = {
    game: string;
    playerData: PlayerStickerData;
}

export default function renderSticker(data: StickerData): string {
    const width = 400
    const height = 400

    const canvas = createCanvas(width, height)

    const context = canvas.getContext('2d')

    drawBackgroundCircle(context, width, height)

    drawPlayerSegments(context, width, height, {
        playersRangeCommunity: {
            minPlayers: 2,
            maxPlayers: 3
        },
        playersRangeOfficial: {
            minPlayers: 1,
            maxPlayers: 4,
        }
    })

    drawDifficulty(context, width, height, 4.5)

    return canvas.toDataURL()
}

function drawBackgroundCircle(context: CanvasRenderingContext2D, width: number, height: number) {
    context.fillStyle = "#001219"
    context.beginPath()
    context.arc(width / 2, height / 2, height / 2, 0, 2 * Math.PI)
    context.fill()
}

function drawDifficulty(context: CanvasRenderingContext2D, width: number, height: number, difficulty: number) {
    const a = 2 * Math.PI / 6
    const r = 50
    const x = width / 2;
    const y = height / 2

    context.fillStyle = "#0a9396"
    context.strokeStyle = "#94d2bd"
    context.lineWidth = Math.min(width, height) / 100;
    context.beginPath()
    for (var i = 0; i < 6; i++) {
        context.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i))
    }
    context.closePath()
    context.fill()
    context.stroke()

    const textString = `${difficulty.toFixed(1)}`
    const textSize = 40

    context.font = `${textSize}px serif`
    context.textBaseline = 'middle'
    context.textAlign = 'center'
    context.fillStyle = "#fff"

    context.fillText(textString, x, y + textSize * 0.1)
}

function drawPlayerSegments(context: CanvasRenderingContext2D, width: number, height: number, playerData: PlayerStickerData) {
    const cx = width / 2
    const cy = height / 2

    const stepOffset = -(0.5 * Math.PI)

    const steps = 8
    const stepFactor = 1 / steps

    for (let step = 0; step < steps; step++) {
        const stepStart = (2 * Math.PI) * stepFactor * step
        const stepEnd = (2 * Math.PI) * stepFactor * (step + 1)

        const currentPlayerCount = step + 1
        if (currentPlayerCount >= playerData.playersRangeCommunity.minPlayers && currentPlayerCount <= playerData.playersRangeCommunity.maxPlayers) {
            context.fillStyle = "#bb3e03"
        } else if (currentPlayerCount >= playerData.playersRangeOfficial.minPlayers && currentPlayerCount <= playerData.playersRangeOfficial.maxPlayers) {
            context.fillStyle = "#ca6702"
        } else {
            context.fillStyle = "#e9d8a6"
        }

        context.lineWidth = 2
        context.strokeStyle = "#ffffff"
        context.beginPath()
        context.moveTo(cx, cy)
        context.arc(cx, cy, height / 3, stepStart + stepOffset, stepEnd + stepOffset)
        context.lineTo(cx, cy)
        context.closePath()
        context.fill()
        context.stroke()
    }
}