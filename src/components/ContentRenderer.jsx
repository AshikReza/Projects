import DefinitionBlock from "./content-blocks/DefinitionBlock";
import ExampleBox from "./content-blocks/ExampleBox";
import DataTable from "./content-blocks/DataTable";
import LimitationsBox from "./content-blocks/LimitationsBox";
import SuccessBox from "./content-blocks/SuccessBox";
import EquationBlock from "./content-blocks/EquationBlock";
import ImportantBox from "./content-blocks/ImportantBox";


export default function ContentRenderer({ block }) {
  switch (block.type) {
    case "definition":
      return <DefinitionBlock title={block.title} text_bn={block.text_bn} text_en={block.text_en} />;
    case "example":
      return <ExampleBox title={block.title} examples={block.examples} />;
    case "table":
      return <DataTable title={block.title} headers={block.headers} rows={block.rows} />;
    case "limitations":
      return <LimitationsBox title={block.title} items={block.items} />;
    case "successes":
        return <SuccessBox title={block.title} items={block.items} />;
    case "equation":
        return <EquationBlock {...block} />;
    case "important":
        return <ImportantBox title={block.title} text_bn={block.text_bn} text_en={block.text_en} />;
    default:
      return <div className="text-red-500">Unknown block type: {block.type}</div>;
  }
}