import { useState, useEffect } from "react";

export default function useChapterTopics(subjectId, chapterId) {
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subjectId || !chapterId) {
        setChapter(null);
        setLoading(false);
        return;
    };

    setLoading(true);
    // UPDATED: The fetch URL now points to the new details.json file
    fetch(`/data/${subjectId}/${chapterId}/details.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Could not fetch details for ${chapterId}`);
        return res.json();
      })
      .then(data => setChapter(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [subjectId, chapterId]);

  return { chapter, loading, error };
}