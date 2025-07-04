import KatexRenderer from '../KatexRenderer'; // <-- Import the renderer

export default function ImportantBox({ title, text_bn, text_en }) {
    return (
        <div className="bg-pink-50 border-l-4 border-pink-400 p-6 rounded-r-lg shadow-sm">
            <h3 className="text-xl font-bold text-pink-800 mb-4">{title}</h3>
            <p className="text-gray-700 leading-relaxed"> <KatexRenderer text={text_bn} /> </p>
            <p className="text-gray-500 italic mt-1 leading-relaxed"><KatexRenderer text={text_en}/></p>
        </div>
    );
}