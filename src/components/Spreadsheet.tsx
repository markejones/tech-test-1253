import React from "react";
import { AgGridReact } from "ag-grid-react";
import { useGrid } from "../hooks/useGrid";
import { agGridTheme } from "../theme/agGridTheme";

export function Spreadsheet() {
  const { columns, cells, updateCellValue } = useGrid();

  React.useEffect(() => {
    console.log("Spreadsheet updated with cells:", cells);
  }, [cells]);

  return (
    <div style={{ height: "600px" }}>
      <AgGridReact
        rowData={cells}
        columnDefs={columns}
        theme={agGridTheme}
        onCellValueChanged={(event) => {
          const { rowIndex, column } = event;
          console.log("event", event);
          updateCellValue({
            rowId: rowIndex!,
            columnId: column.getColId(),
            value: event.value,
          });
        }}
      />
    </div>
  );
}
