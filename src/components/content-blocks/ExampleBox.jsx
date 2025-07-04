// components/ExampleBlock.js
import KatexRenderer from '../KatexRenderer'; // <-- Import the renderer

export default function ExampleBlock({ title, examples }) {
    return (
        <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg shadow-sm my-4">
            <h3 className="text-xl font-bold text-green-800 mb-4">{title}</h3>
            {examples.map((example, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-green-200 last:border-b-0 last:mb-0 last:pb-0">
                    {/* Use the renderer for the example text. 
                        The 'whitespace-pre-wrap' class helps preserve line breaks (\n). */}
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        <KatexRenderer text={example.bn} />
                    </div>
                    <div className="text-gray-500 italic mt-1 leading-relaxed whitespace-pre-wrap">
                        <KatexRenderer text={example.en} />
                    </div>
                </div>
            ))}
        </div>
    );
}