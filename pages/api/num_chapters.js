// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const bible_api_address = 'https://www.abibliadigital.com.br/api'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkZyaSBBdWcgMjAgMj' +
              'AyMSAwMDo0NDozMyBHTVQrMDAwMC42MTFlNTA2ZjExMDNlODAwMjMxNGNiZTYiL' +
              'CJpYXQiOjE2Mjk0MjAyNzN9.sMQJRGveFyVUHPdhppVKlNa9FzdWVg_2fzeZaPSdnSk'

const authObj = {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
  },
}

export default async function handler(req, res) {
  // Calling the Bible API to get the list of Bible books
  const response = await fetch(
    `${bible_api_address}/books`,
    authObj
  )

  const books = await response.json()

  // Adding up chapters by testament
  let ot_num_chapters = 0
  let nt_num_chapters = 0

  books.map(book => {
    if(book.testament === 'VT') {
      ot_num_chapters += book.chapters
    } else {
      nt_num_chapters += book.chapters
    }
  })

  const number_of_chapters = ot_num_chapters + nt_num_chapters

  res.status(200).json({
    'Capítulos do Antigo Testamento': ot_num_chapters,
    'Capítulos do Novo Testamento': nt_num_chapters,
    'Total de capítulos da Bíblia': number_of_chapters,
  })
}
