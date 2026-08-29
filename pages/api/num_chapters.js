// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const bible_api_host = "https://www.abibliadigital.api.br";

export default async function handler(req, res) {
  // Calling the Bible API to get the list of Bible books
  const response = await fetch(`${bible_api_host}/api/books`);

  const books = await response.json();

  const report = books.map((book) => ({
    name: book.name,
    chapters: book.chapters,
  }));

  res.status(200).json(report);
}
