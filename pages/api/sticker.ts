// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { createCanvas } from 'canvas'


type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const width = 400
  const height = 400

  const canvas = createCanvas(width, height)

  const context = canvas.getContext('2d')
  context.fillStyle = '#000'
  context.fillRect(0, 0, width, height)

  const canvasDataUrl =  canvas.toDataURL()

  res.status(200).json({ name: canvasDataUrl })
}
