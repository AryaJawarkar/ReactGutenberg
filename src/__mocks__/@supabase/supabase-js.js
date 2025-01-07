const createClient = () => ({
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    range: jest.fn().mockResolvedValue({
      data: [
        {
          gutenberg_id: 1,
          title: 'Test Book',
          download_count: 100,
          books_book_authors: [
            {
              books_author: {
                name: 'Test Author',
                birth_year: 1900,
                death_year: 1950
              }
            }
          ],
          books_format: [
            {
              mime_type: 'image/jpeg',
              url: 'test-image.jpg'
            }
          ]
        }
      ],
      count: 1
    })
  }))
});

module.exports = {
  createClient
}; 