// src/components/layout/CollapsibleChapterLink.jsx (Corrected)

import { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import useChapterTopics from '../../hooks/useChapterTopics';

const Icon = ({ name, ...props }) => {
  const LucideIcon = LucideIcons[name];
  return LucideIcon ? <LucideIcon {...props} /> : <LucideIcons.BookText {...props} />;
};

export default function CollapsibleChapterLink({ chapter, isSidebarCollapsed, onLinkClick }) {
  const { subjectId, chapterId } = useParams();
  const isChapterActive = chapterId === chapter.id;
  const [isOpen, setIsOpen] = useState(isChapterActive);

  useEffect(() => {
    setIsOpen(isChapterActive);
  }, [isChapterActive]);

  const { chapter: chapterData, loading } = useChapterTopics(subjectId, isOpen ? chapter.id : null);
  
  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-gray-100 ${isChapterActive ? 'bg-gray-100 font-semibold' : ''} ${isSidebarCollapsed ? 'h-9 w-9 justify-center' : ''}`}
        title={chapter.title}
      >
        <Icon name={chapter.icon} className="h-4 w-4" />
        <span className={`flex-1 text-left truncate ${isSidebarCollapsed ? 'hidden' : ''}`}>{chapter.title}</span>
        <LucideIcons.ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${isSidebarCollapsed ? 'hidden' : ''}`} />
      </button>

      {!isSidebarCollapsed && isOpen && (
        <div className="pl-8 pr-2 mt-1 space-y-1 border-l-2 ml-4 border-gray-200">
          {loading && <p className="text-xs text-gray-500 p-2">লোড হচ্ছে...</p>}
          {chapterData?.topics.map(topic => (
            <div key={topic.title} className="mt-1">
              <h4 className="font-semibold text-gray-500 text-sm p-1">{topic.title}</h4>
              <div className="flex flex-col space-y-1">
                {topic.subtopics.map(subtopic => (
                  <NavLink
                    key={subtopic.contentId}
                    to={`/subjects/${subjectId}/${chapter.id}/${subtopic.contentId}`}
                    onClick={onLinkClick}
                    // --- THIS IS THE CORRECTED LINE ---
                    className={({ isActive }) => `block px-2 py-1.5 rounded-md text-sm transition-colors ${isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    {subtopic.title}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}