import { useState, useEffect } from "react";

export default function useSubjectManifest(subjectId) {
  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subjectId) return;

    setLoading(true);
    fetch(`/data/${subjectId}/manifest.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Could not fetch manifest for ${subjectId}`);
        return res.json();
      })
      .then(data => setManifest(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [subjectId]);

  return { manifest, loading, error };
}