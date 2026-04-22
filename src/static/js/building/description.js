function generateDescription(content) {
  if (!content)
    return "personal portfolio website that collects all my projects and professional experiences.";
  const paragraphs = content.match(/<p>[\s\S]*?<\/p>/g) || [];
  const text = paragraphs
    .map((p) => p.replace(/<\/?p>/g, "")) // remove <p> tags
    .join(" ") // join all paragraphs
    .replace(/<[^>]*>/g, "") // remove all html tags
    .replace(/\s+/g, " ") // remove extra spaces
    .trim();
  return text.slice(0, 160) + (text.length > 160 ? "..." : "");
}

module.exports = {
  generateDescription,
};
