import { useParams } from "react-router-dom";
import useSubjectData from "../hooks/useSubjectData";
import ContentRenderer from "../components/core/ContentRenderer";

export default function ChapterPage() {
  const { subjectId, chapterId } = useParams();
  const { data, loading, error } = useSubjectData(subjectId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const chapter = data.chapters?.[chapterId];

  if (!chapter) return <div>Chapter not found.</div>;

  return (
    <article>
      <h1 className="text-4xl font-bold mb-8 pb-4 border-b-2 border-gray-200">{chapter.title}</h1>
      <div className="space-y-8">
        {chapter.content.map((block, index) => (
          <ContentRenderer key={index} block={block} />
        ))}
      </div>
    </article>
  );
}