import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'

import List from '../components/list'
import styles from '../styles/home.module.css'

export default function Home() {
  const USER = 0
  const API = 1

  const [version, setVersion] = useState(['ACF', 'acf'])
  const [book, setBook] = useState(['Josué', 'js'])
  const [chapter, setChapter] = useState(1)
  const [verse, setVerse] = useState(6)
  const [text, setText] = useState('')
  const [books, setBooks] = useState(['', ''])

  const bible_api_address = 'https://www.abibliadigital.com.br/api'

  const getVerseText = useCallback(async () => {
    // Calling the Bible API to get the Bible verse
    const response = await fetch(
      `${bible_api_address}/verses/${version[API]}/${book[API]}/${chapter}/${verse}`
    )

    const verse_data = await response.json()
    setText(verse_data.text)
  }, [version, book, chapter, verse])

  const getBibleBooks = useCallback(async () => {
    // Calling the Bible API to get the list of Bible books
    const response = await fetch(
      `${bible_api_address}/books`
    )

    const books = await response.json()
    setBooks(books.map(book => [book.name, book.abbrev.pt]))
  }, [])

  useEffect(() => {
    getVerseText()
    getBibleBooks()
  }, [getVerseText, getBibleBooks])

  return (
    <div>
      <Head>
        <title>Simple Bible Verse App</title>
        <meta name="description" content="Simple app to read a Bible verse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.selection}>
          <List title='Versão:' item={version[USER]} />
          <List title='Livro:' item={book[USER]} />
          <List title='Capítulo:' item={chapter} />
          <List title='Versículo:' item={verse} />
        </div>
        <div className={styles.text}>
          {text}
        </div>
        <div className={styles.text}>
          {books.slice(0, 8).map(book => book[USER]).join(', ')}
        </div>
        <div className={styles.text}>
          {books.slice(0, 8).map(book => book[API]).join(', ')}
        </div>
      </main>
    </div>
  )
}
