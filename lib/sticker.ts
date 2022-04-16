import { createCanvas } from 'canvas'

type PlayersRange = {
    minPlayers: number
    maxPlayers: number
}

type PlayerStickerData = {
    playersRangeOfficial: PlayersRange
    playersRangeCommunity: PlayersRange
    playersRangePreffered: PlayersRange
}

type StickerData = {
    game: string
    difficulty: number
    playerData: PlayerStickerData
}

type ColorTheme = {
    backgroundColor: string
    strokeColor: string
    textColor: string
    difficultyColor: string
    defaultPlayersColor: string
    officialPlayersColor: string
    communityPlayersColor: string
    preferredPlayersColor: string
}

export default function renderSticker(data: StickerData = {
    game: "Test Game",
    difficulty: 4.5,
    playerData: {
        playersRangeOfficial: {
            minPlayers: 3,
            maxPlayers: 7,
        },
        playersRangeCommunity: {
            minPlayers: 1,
            maxPlayers: 6
        },
        playersRangePreffered: {
            minPlayers: 2,
            maxPlayers: 3
        },
    }
}): string {
    const width = 400
    const height = 400
    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    const theme: ColorTheme = {
        backgroundColor: "#264653",
        strokeColor: "#ffffff",
        textColor: "#264653",
        difficultyColor: "#264653",
        defaultPlayersColor: "#e9c46a",
        officialPlayersColor: "#f4a261",
        communityPlayersColor: "#e9c46a",
        preferredPlayersColor: "#2a9d8f",
    }

    drawBackgroundCircle(context, width, height, theme)
    drawPlayerSegments(context, width, height, data.playerData, theme)
    drawOfficialInnerCircle(context, width, height, data.playerData, theme)
    drawDifficulty(context, width, height, data.difficulty, theme)

    return canvas.toDataURL()
}

function drawBackgroundCircle(context: CanvasRenderingContext2D, width: number, height: number, theme: ColorTheme) {
    context.fillStyle = theme.backgroundColor
    context.beginPath()
    context.arc(width / 2, height / 2, height / 2, 0, 2 * Math.PI)
    context.fill()
}

function drawDifficulty(context: CanvasRenderingContext2D, width: number, height: number, difficulty: number, theme: ColorTheme) {
    const a = 2 * Math.PI / 6
    const minSize = Math.min(height, width)
    const r = minSize * 0.135
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
    const textSize = minSize * 0.1

    context.font = `${textSize}px Arial`
    context.fillStyle = theme.difficultyColor
    context.textBaseline = 'middle'
    context.textAlign = 'center'

    context.fillText(textString, x, y)
}

function drawOfficialInnerCircle(context: CanvasRenderingContext2D, width: number, height: number, playerData: PlayerStickerData, theme: ColorTheme) {
    const cx = width / 2
    const cy = height / 2
    const minSize = Math.min(height, width)
    const radius = minSize * 0.25
    const ringWidth = 10

    const stepOffset = -(0.5 * Math.PI)

    const steps = 8
    const stepFactor = 1 / steps
    const stepStart = (2 * Math.PI) * stepFactor * (playerData.playersRangeOfficial.minPlayers - 1)
    const stepEnd = (2 * Math.PI) * stepFactor * (playerData.playersRangeOfficial.maxPlayers)

    context.lineWidth = ringWidth
    context.strokeStyle = theme.officialPlayersColor
    context.beginPath()
    context.moveTo(cx, cy)
    context.arc(cx, cy, radius - ringWidth * 0.5, stepStart + stepOffset, stepEnd + stepOffset)
    context.lineTo(cx, cy)
    context.closePath()
    context.stroke()


    // Masking out stroke overlaps and inner circles
    if (playerData.playersRangeOfficial.minPlayers > 1 && playerData.playersRangeOfficial.maxPlayers < steps) {
        const stepOverDrawStart = (2 * Math.PI) * stepFactor * (playerData.playersRangeOfficial.maxPlayers)
        const stepOverDrawEnd = (2 * Math.PI) * stepFactor * (playerData.playersRangeOfficial.minPlayers - 1)

        context.fillStyle = theme.backgroundColor
        context.beginPath()
        context.moveTo(cx, cy)
        context.arc(cx, cy, Math.ceil(radius), stepOverDrawStart + stepOffset, stepOverDrawEnd + stepOffset)
        context.lineTo(cx, cy)
        context.closePath()
        context.fill()
    }

    // Clip out inbound strokes
    context.fillStyle = theme.backgroundColor
    context.beginPath()
    context.moveTo(cx, cy)
    context.arc(cx, cy, Math.ceil(radius - ringWidth), 0, 2 * Math.PI)
    context.lineTo(cx, cy)
    context.closePath()
    context.fill()
}

function drawPlayerSegments(context: CanvasRenderingContext2D, width: number, height: number, playerData: PlayerStickerData, theme: ColorTheme) {
    const cx = width / 2
    const cy = height / 2
    const minSize = Math.min(height, width)
    const textSize = minSize * 0.05
    const radius = (minSize / 2) * 0.9

    const stepOffset = -(0.5 * Math.PI)

    const steps = 8
    const stepFactor = 1 / steps

    for (let step = 0; step < steps; step++) {
        const stepStart = (2 * Math.PI) * stepFactor * step
        const stepEnd = (2 * Math.PI) * stepFactor * (step + 1)

        const currentPlayerCount = step + 1
        if (currentPlayerCount >= playerData.playersRangePreffered.minPlayers && currentPlayerCount <= playerData.playersRangePreffered.maxPlayers) {
            context.fillStyle = theme.preferredPlayersColor
        } else if (currentPlayerCount >= playerData.playersRangeCommunity.minPlayers && currentPlayerCount <= playerData.playersRangeCommunity.maxPlayers) {
            context.fillStyle = theme.communityPlayersColor
        } else {
            context.fillStyle = theme.defaultPlayersColor
        }

        context.lineWidth = 2
        context.strokeStyle = theme.strokeColor
        context.beginPath()
        context.moveTo(cx, cy)
        context.arc(cx, cy, radius, stepStart + stepOffset, stepEnd + stepOffset)
        context.lineTo(cx, cy)
        context.closePath()
        context.fill()
        context.stroke()

        // Draw text
        context.fillStyle = theme.textColor
        context.font = `${textSize}px bold Arial`
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        var mid = stepOffset + (stepStart + stepEnd) / 2
        context.fillText(`${currentPlayerCount}`, cx + Math.cos(mid) * (radius * 0.75), cy + Math.sin(mid) * (radius * 0.75));
    }
}