import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import useSWR, {  Fetcher } from 'swr'

const fetcher: Fetcher<string, string> = (url: string) => fetch(url).then((res) => res.json()).then((json) => json.imageData)


const Home: NextPage = () => {
  const { data} = useSWR('/api/sticker', fetcher)

  console.log(data);

  return (
    <div className={styles.container}>
      <img src={data}></img>
    </div>
  )
}

export default Home
