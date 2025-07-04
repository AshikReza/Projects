// src/components/layout/Sidebar.jsx
import CollapsibleChapterLink from './CollapsibleChapterLink';

export default function Sidebar({ isCollapsed, manifest, onLinkClick }) { // <-- Add onLinkClick here
  return (
    <div className="flex-1 overflow-auto">
      <nav className="grid gap-1 p-2">
        {manifest?.papers?.map(paper => (
          <div key={paper.paperTitle} className="mb-2">
            {!isCollapsed && (
              <h3 className="px-2 py-1 text-sm font-semibold text-gray-500">{paper.paperTitle}</h3>
            )}
             {isCollapsed && <hr className="my-2"/>}
            {paper.chapters.map(chapter => (
              <CollapsibleChapterLink
                key={chapter.id}
                chapter={chapter}
                isSidebarCollapsed={isCollapsed}
                onLinkClick={onLinkClick} // <-- Pass it down
              />
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
}