import Head from 'next/head'
import { useCallback, useEffect, useRef, useState } from 'react'

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

  const versionSelRef = useRef()
  const bookSelRef = useRef()
  const chapterSelRef = useRef()
  const verseSelRef = useRef()

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

    // The indentation to avoid 'versions.map is not a function' error
    setVersions(versions
      .map(version => ({
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

    // The indentation to avoid 'books.map is not a function' error
    setBooks(books
      .map(book => ({
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

  const handleVersionSel = () => {
    setVersion(versionSelRef.current.value)
  }

  const handleBookSel = () => {
    setBook(bookSelRef.current.value)
  }

  const handleChapterSel = () => {
    setChapter(chapterSelRef.current.value)
  }

  const handleVerseSel = () => {
    setVerse(verseSelRef.current.value)
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
          <List selRef={versionSelRef} title='Versão:' items={versions} onChange={handleVersionSel} />
          <List selRef={bookSelRef} title='Livro:' items={books} onChange={handleBookSel} />
          <List selRef={chapterSelRef} title='Capítulo:' items={chapters} onChange={handleChapterSel} />
          <List selRef={verseSelRef} title='Versículo:' items={verses} onChange={handleVerseSel} />
        </form>

        <div className={styles.text}>
          {text}
        </div>
      </main>
    </div>
  )
}
