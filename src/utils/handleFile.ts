export function extractFileName(term: string) {
  const parts = term.split("/");
  return parts[parts.length - 1].trim();
}
export function isFile(term: string) {
  const fileRegex = /^\.?[\w\-\/]+\.[\w]+$/;
  return fileRegex.test(term);
}
