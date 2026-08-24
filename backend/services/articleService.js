/**
 * Calculates estimated reading time in minutes based on ~200 words per minute.
 * @param {string} content - Article body text
 * @returns {number} Estimated reading time in minutes (minimum 1 minute)
 */
const calculateReadingTime = (content) => {
  if (!content || typeof content !== 'string') {
    return 1;
  }
  
  // Strip HTML tags if any, then count words
  const cleanText = content.replace(/<[^>]*>/g, ' ').trim();
  const wordCount = cleanText.split(/\s+/).filter((word) => word.length > 0).length;
  
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return minutes > 0 ? minutes : 1;
};

/**
 * Builds a Mongoose query object based on search and filter parameters.
 * @param {Object} queryParams - Express request query parameters
 * @returns {Object} Mongoose filter object
 */
const buildArticleQuery = (queryParams) => {
  const filter = {};
  const { status, category, tags, authorId, search } = queryParams;

  if (status) {
    filter.status = status;
  }

  if (category) {
    filter.category = category;
  }

  if (authorId) {
    filter.authorId = authorId;
  }

  if (tags) {
    if (Array.isArray(tags)) {
      filter.tags = { $in: tags };
    } else if (typeof tags === 'string') {
      const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
      filter.tags = { $in: tagList };
    }
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { content: searchRegex },
      { category: searchRegex },
      { tags: searchRegex }
    ];
  }

  return filter;
};

module.exports = {
  calculateReadingTime,
  buildArticleQuery
};
