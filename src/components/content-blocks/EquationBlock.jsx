import { BlockMath } from 'react-katex';
import KatexRenderer from '../KatexRenderer'; // <-- Import the renderer

export default function EquationBlock({ title, equation, description_bn, description_en }) {
    return (
        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-6 rounded-r-lg shadow-sm">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">{title}</h3>
            <div className="bg-white p-4 rounded-md text-center my-4 overflow-x-auto">
                <BlockMath math={equation} />
            </div>
            {/* Use the renderer for the descriptions */}
            <p className="text-gray-700 leading-relaxed">
                <KatexRenderer text={description_bn} />
            </p>
            <p className="text-gray-500 italic mt-1 leading-relaxed">
                <KatexRenderer text={description_en} />
            </p>
        </div>
    );
}