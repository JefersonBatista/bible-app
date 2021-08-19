import Head from 'next/head'
import { useCallback, useEffect, useState } from 'react'

import List from '../components/List'
import styles from '../styles/home.module.css'

export default function Home() {
  const [versions, setVersions] = useState([])
  const [books, setBooks] = useState([])
  const [chapters, setChapters] = useState([])
  const [verses, setVerses] = useState([])

  const [version, setVersion] = useState('acf')
  const [book, setBook] = useState('gn')
  const [chapter, setChapter] = useState(1)
  const [verse, setVerse] = useState(1)
  const [text, setText] = useState('')

  const bible_api_address = 'https://www.abibliadigital.com.br/api'

  const getVerseText = useCallback(async () => {
    // Calling the Bible API to get the Bible verse
    const response = await fetch(
      `${bible_api_address}/verses/${version}/${book}/${chapter}/${verse}`
    )

    const verse_data = await response.json()
    setText(verse_data.text)
  }, [version, book, chapter, verse])

  const getBibleVersions = async () => {
    // Calling the Bible API to get the list of available versions
    const response = await fetch(
      `${bible_api_address}/versions`
    )

    const versions = await response.json()

    setVersions(versions.map(version => ({
        value: version.version,
        label: version.version.toUpperCase(),
      }))
    )
  }

  const getBibleBooks = async () => {
    // Calling the Bible API to get the list of Bible books
    const response = await fetch(
      `${bible_api_address}/books`
    )

    const books = await response.json()

    setBooks(books.map(book => ({
        value: book.abbrev.pt,
        label: book.name, 
      }))
    )
  }

  const getChapterNumbers = useCallback(async () => {
    // Calling the Bible API to get the number of chapters of the selected book
    const response = await fetch(
      `${bible_api_address}/books/${book}`
    )

    const book_info = await response.json()
    const number_of_chapters = book_info.chapters

    setChapters([...Array(number_of_chapters).keys()].map(c => ({
      value: c+1,
      label: c+1,
    })))
  }, [book])

  const getVerseNumbers = useCallback(async () => {
    // Calling the Bible API to get the number of verses of the selected chapter
    const response = await fetch(
      `${bible_api_address}/verses/${version}/${book}/${chapter}`
    )

    const chapter_info = await response.json()
    const number_of_verses = chapter_info.chapter.verses
    setVerses([...Array(number_of_verses).keys()].map(v => ({
      value: v+1,
      label: v+1,
    })))
  }, [version, book, chapter])

  const handleVersionSel = (event) => {
    setVersion(event.target.value)
  }

  const handleBookSel = (event) => {
    setBook(event.target.value)
  }

  const handleChapterSel = (event) => {
    setChapter(event.target.value)
  }

  const handleVerseSel = (event) => {
    setVerse(event.target.value)
  }

  useEffect(() => {
    getBibleVersions()
    getBibleBooks()
  }, [])

  useEffect(() => {
    getChapterNumbers()
  }, [getChapterNumbers])

  useEffect(() => {
    getVerseNumbers()
  }, [getVerseNumbers])

  useEffect(() => {
    getVerseText()
  }, [getVerseText])

  return (
    <div>
      <Head>
        <title>Simple Bible Verse App</title>
        <meta name="description" content="Simple app to read a Bible verse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* The onSubmit function of this form is still missing */}
        <form className={styles.selection}>
          <List title='Versão:' items={versions} handleChange={handleVersionSel} />
          <List title='Livro:' items={books} handleChange={handleBookSel} />
          <List title='Capítulo:' items={chapters} handleChange={handleChapterSel} />
          <List title='Versículo:' items={verses} handleChange={handleVerseSel} />
        </form>

        <div className={styles.text}>
          {text}
        </div>
      </main>
    </div>
  )
}
