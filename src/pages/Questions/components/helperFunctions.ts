export const copyTextToClipboard = async (text: string) => {
  return navigator.clipboard
    .writeText(text)
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.error('Failed to copy text: ', error);
      return false;
    });
};
