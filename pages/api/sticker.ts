// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import renderSticker from '../../lib/sticker'

type StickerRequestData = {
  imageData: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<StickerRequestData>
) {
  res.status(200).json({ imageData: renderSticker() })
}


