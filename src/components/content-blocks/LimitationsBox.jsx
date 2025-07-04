import KatexRenderer from "../KatexRenderer";

export default function LimitationsBox({ title, items }) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg shadow-sm">
      <h3 className="text-xl font-bold text-yellow-800 mb-4">{title}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index}>
            <p className="text-gray-700 leading-relaxed"><KatexRenderer text={item.bn} /></p>
            <p className="text-gray-500 italic mt-1 leading-relaxed"><KatexRenderer text={item.en} /></p>
          </li>
        ))}
      </ul>
    </div>
  );
}