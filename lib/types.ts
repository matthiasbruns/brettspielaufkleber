export type CollectionItem = {
    name: string
    originalName: string
    yearPublished: number
    image: string
    thumbnail: string
}

export type UserCollection = {
    items: CollectionItem[]
}