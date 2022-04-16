// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { stringify } from 'querystring'
import fetchUserCollection from '../../../lib/boardgamegeek'
import renderSticker from '../../../lib/sticker'
import { UserCollection } from '../../../lib/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username } = req.query

  if (username! instanceof String) {
    res.status(400).json({ message: "username is not string" });
  } else {
    const data = await fetchUserCollection(username as string)
    res.status(200).json(data)
  }
}
