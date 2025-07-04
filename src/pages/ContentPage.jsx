import { useParams } from "react-router-dom";
import ContentRenderer from "../components/ContentRenderer";
// This import path is correct, but it now points to the file you renamed.
import useChapterContent from "../hooks/useSubjectContent";

export default function ContentPage() {
    const { subjectId, chapterId, contentId } = useParams();
    const { content, loading, error } = useChapterContent(subjectId, chapterId);

    if (loading) return <div className="text-center p-10">বিষয়বস্তু লোড হচ্ছে...</div>;
    if (error) return <div className="text-center p-10 text-red-500">নোট খুঁজে পাওয়া যায়নি।</div>;

    const contentData = content?.[contentId];

    if (!contentData) return <div className="text-center p-10 text-gray-500">এই টপিকের জন্য কোনো নোট যোগ করা হয়নি।</div>;

    return (
        <article className="p-0 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 pb-4 border-b-2 border-gray-200">{contentData.title}</h1>
            <div className="space-y-8">
                {contentData.blocks.map((block, index) => (
                    <ContentRenderer key={index} block={block} />
                ))}
            </div>
        </article>
    );
}