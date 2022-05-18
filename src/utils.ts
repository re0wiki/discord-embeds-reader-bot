/**
 * @see https://stackoverflow.com/a/39914235/13805358
 */
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { sleep };
