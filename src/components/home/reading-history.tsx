const STORAGE_KEY = "readComics";
const getReadChapters = (comicId: number) => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  return data.find((item: any) => item.id === comicId);
};

const saveReadChapter = (
  comicId: number,
  chapterId: number,
  chapterUrl: string
) => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const index = data.findIndex((item: any) => item.id === comicId);

  if (index !== -1) {
    const item = data[index];
    if (!item.chapterIds.includes(chapterId)) {
      item.chapterIds.push(chapterId);
    }
    item.lastRead = { chapterId, chapterUrl };
    data[index] = item;
  } else {
    data.push({
      id: comicId,
      chapterIds: [chapterId],
      lastRead: { chapterId, chapterUrl },
    });
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export { getReadChapters, saveReadChapter };
