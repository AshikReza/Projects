import { useState, useEffect } from "react";

export default function useChapterContent(subjectId, chapterId) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This hook now requires both subjectId and chapterId to run.
    if (!subjectId || !chapterId) {
        setContent(null);
        setLoading(false);
        return;
    };

    setLoading(true);
    // UPDATED: The fetch URL now points to the new chapter-specific content.json
    fetch(`/data/${subjectId}/${chapterId}/content.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Could not fetch content for ${chapterId}`);
        return res.json();
      })
      .then(data => setContent(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [subjectId, chapterId]);

  return { content, loading, error };
}