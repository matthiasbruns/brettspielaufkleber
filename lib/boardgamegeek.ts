import axios from "axios"
import { CollectionItem, UserCollection } from "./types"
import parseStringAsync from "./xml2js"

const apiRoot: string = "https://boardgamegeek.com/xmlapi2"

type CollectionResponseItemMeta = {
    objectid: number
    subtype: string
    collid: number
}

type CollectionNameMeta = {
    _: string
}

type CollectionResponseItem = {
    $: CollectionResponseItemMeta
    name: CollectionNameMeta[]
    originalname: string[]
    yearpublished: number[]
    image: string
    thumbnail: string
}

type CollectionResponseItems = {
    item: CollectionResponseItem[]
}

type CollectionResponseData = {
    items: CollectionResponseItems
}

export default async function fetchUserCollection(username: String): Promise<UserCollection> {
    const response = await axios.get(`${apiRoot}/collection?username=${username}`)
    const resultJson: CollectionResponseData = await parseStringAsync(response.data)
    const items = resultJson.items.item

    return {
        items: items.map((item) => {
            const mapped: CollectionItem = {
                name: item.name ? item.name[0]._ : "",
                originalName: item.originalname ? item.originalname[0] : "",
                image: item.image,
                thumbnail: item.thumbnail,
                yearPublished: item.yearpublished ? item.yearpublished[0] : 0
            }
            return mapped
        })
    }
}