import { BlockMath } from "react-katex";

export const FormulaBlock = ({ content }: { content: string }) => (
  <div className="text-lg md:text-xl p-4 my-2 rounded-md bg-muted/50 flex justify-center items-center overflow-x-auto">
    <BlockMath math={content} />
  </div>
);
