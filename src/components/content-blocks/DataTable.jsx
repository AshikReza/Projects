import KatexRenderer from "../KatexRenderer";

export default function DataTable({ title, headers, rows }) {
    return (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {/* The title itself can also be rendered with Katex if needed */}
                <KatexRenderer text={title} />
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-blue-100">
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} className="py-2 px-4 border-b text-left font-semibold text-gray-600">
                                    {/* Render headers with Katex */}
                                    <KatexRenderer text={header} />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50">
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="py-2 px-4 border-b">
                                        {/* THIS IS THE KEY CHANGE: Render each cell with KatexRenderer */}
                                        <KatexRenderer text={cell} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}