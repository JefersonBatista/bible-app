import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import List from "../components/List";
import styles from "../styles/home.module.css";

export default function Home() {
  const [versions, setVersions] = useState([]);
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [verses, setVerses] = useState([]);

  const [version, setVersion] = useState("acf");
  const [book, setBook] = useState("gn");
  const [chapter, setChapter] = useState(1);
  const [verse, setVerse] = useState(1);

  const [verseTexts, setVerseTexts] = useState([]);
  const [text, setText] = useState("");

  const bible_api_address = "https://www.abibliadigital.com.br/api";

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkZyaSBBdWcgMjAgMj" +
    "AyMSAwMDo0NDozMyBHTVQrMDAwMC42MTFlNTA2ZjExMDNlODAwMjMxNGNiZTYiL" +
    "CJpYXQiOjE2Mjk0MjAyNzN9.sMQJRGveFyVUHPdhppVKlNa9FzdWVg_2fzeZaPSdnSk";

  const authObj = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getVerseText = useCallback(async () => {
    setText(verseTexts[verse - 1]);
  }, [verseTexts, verse]);

  const getBibleVersions = async () => {
    // Calling the Bible API to get the list of available versions
    const response = await fetch(`${bible_api_address}/versions`, authObj);

    const versions = await response.json();

    setVersions(
      versions.map((version) => ({
        value: version.version,
        label: version.version.toUpperCase(),
      }))
    );
  };

  const getBibleBooks = async () => {
    // Calling the Bible API to get the list of Bible books
    const response = await fetch(`${bible_api_address}/books`, authObj);

    const books = await response.json();

    setBooks(
      books.map((book) => ({
        value: book.abbrev.pt,
        label: book.name,
      }))
    );
  };

  const getChapterNumbers = useCallback(async () => {
    // Calling the Bible API to get the number of chapters of the selected book
    const response = await fetch(`${bible_api_address}/books/${book}`, authObj);

    const book_info = await response.json();
    const number_of_chapters = book_info.chapters;

    setChapters(
      [...Array(number_of_chapters).keys()].map((c) => ({
        value: c + 1,
        label: c + 1,
      }))
    );
  }, [book]);

  const getChapterVerses = useCallback(async () => {
    // Calling the Bible API to get the number of verses of the selected chapter
    const response = await fetch(
      `${bible_api_address}/verses/${version}/${book}/${chapter}`,
      authObj
    );

    const chapter_info = await response.json();
    const number_of_verses = chapter_info.chapter.verses;
    setVerses(
      [...Array(number_of_verses).keys()].map((v) => ({
        value: v + 1,
        label: v + 1,
      }))
    );

    const new_verse_texts = chapter_info.verses.map((v) =>
      decodeHtmlSpecialChars(v.text)
    );

    setVerseTexts(new_verse_texts);
  }, [version, book, chapter]);

  const handleVersionSel = async (event) => {
    const new_version = event.target.value;

    // Calling the Bible API to get the number of verses of the selected chapter
    const response = await fetch(
      `${bible_api_address}/verses/${new_version}/${book}/${chapter}`,
      authObj
    );

    const chapter_info = await response.json();
    const number_of_verses = chapter_info.chapter.verses;

    setVerse(Math.min(verse, number_of_verses));
    setVersion(new_version);
  };

  const handleBookSel = (event) => {
    setBook(event.target.value);
    setChapter(1);
    setVerse(1);
  };

  const handleChapterSel = (event) => {
    setChapter(parseInt(event.target.value));
    setVerse(1);
  };

  const handleVerseSel = (event) => {
    setVerse(parseInt(event.target.value));
  };

  const prevVerse = () => {
    setVerse(verse - 1);
  };

  const nextVerse = () => {
    setVerse(verse + 1);
  };

  const decodeHtmlSpecialChars = (text) => {
    const span = document.createElement("span");
    span.innerHTML = text;
    return span.textContent;
  };

  useEffect(() => {
    getBibleVersions();
    getBibleBooks();
  }, []);

  useEffect(() => {
    getChapterNumbers();
  }, [getChapterNumbers]);

  useEffect(() => {
    getChapterVerses();
  }, [getChapterVerses]);

  useEffect(() => {
    getVerseText();
  }, [getVerseText]);

  return (
    <div>
      <Head>
        <title>Simple Bible Verse App</title>
        <meta name="description" content="Simple app to read a Bible verse" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <div className={styles.selection}>
          <List
            title="Versão:"
            items={versions}
            value={version}
            handleChange={handleVersionSel}
          />
          <List
            title="Livro:"
            items={books}
            value={book}
            handleChange={handleBookSel}
          />
          <List
            title="Capítulo:"
            items={chapters}
            value={chapter}
            handleChange={handleChapterSel}
          />
          <List
            title="Versículo:"
            items={verses}
            value={verse}
            handleChange={handleVerseSel}
          />
        </div>

        <div className={styles.textArea}>
          <button
            className={
              verse === 1 ? styles.hiddenPrevButton : styles.prevButton
            }
            onClick={prevVerse}
          >
            <FaAngleLeft className={styles.icon} size={30} color="rgb(81, 159, 187)" />
          </button>

          <div className={styles.text}>{text}</div>

          <button
            className={
              verse === verseTexts.length
                ? styles.hiddenNextButton
                : styles.nextButton
            }
            onClick={nextVerse}
          >
            <FaAngleRight className={styles.icon} size={30} color="rgb(81, 159, 187)" />
          </button>
        </div>

        <footer className={styles.footer}>
          <span>
            Este aplicativo web foi desenvolvido sobre{" "}
            <Link href="https://www.abibliadigital.com.br/">
              <a
                className={styles.link}
                target="_blank"
                rel="noreferrer noopener"
              >
                ABíbliaDigital | Uma API REST para a Bíblia
              </a>
            </Link>
          </span>
        </footer>
      </div>
    </div>
  );
}
