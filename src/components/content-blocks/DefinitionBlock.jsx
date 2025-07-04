import KatexRenderer from '../KatexRenderer';

export default function DefinitionBlock({ title, text_bn, text_en }) {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg shadow-sm">
      <h3 className="text-xl font-bold text-blue-800 mb-2">{title}</h3>

      {/* 2. This is the only change you need to make */}
      <p className="text-gray-700 leading-relaxed">
        <KatexRenderer text={text_bn} />
      </p>
      <p className="text-gray-500 italic mt-2 leading-relaxed">
        <KatexRenderer text={text_en} />
      </p>
    </div>
  );
}