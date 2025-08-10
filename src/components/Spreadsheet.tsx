import React from "react";
import { AgGridReact } from "ag-grid-react";
import { ColumnKey, useGrid } from "../hooks/useGrid";
import { agGridTheme } from "../theme/agGridTheme";

export function Spreadsheet() {
  const { columns, rows, updateCellValue } = useGrid();

  React.useEffect(() => {
    console.log("Spreadsheet updated with rows:", rows);
  }, [rows]);

  return (
    <div style={{ height: "600px" }}>
      <AgGridReact
        rowData={rows}
        columnDefs={columns}
        theme={agGridTheme}
        onCellValueChanged={(event) => {
          const { rowIndex, column } = event;
          console.log("event", event);
          updateCellValue({
            rowId: rowIndex!,
            columnId: column.getColId() as ColumnKey,
            value: event.value,
          });
        }}
      />
    </div>
  );
}
