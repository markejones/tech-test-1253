import React from "react";
import { AgGridReact } from "ag-grid-react";
import { useGrid } from "../hooks/useGrid";
import { agGridTheme } from "../theme/agGridTheme";

export function Spreadsheet() {
  const { columns, cells, updateCellValue } = useGrid();

  return (
    <div style={{ height: "600px" }}>
      <AgGridReact
        rowData={cells}
        columnDefs={columns}
        theme={agGridTheme}
        onCellValueChanged={(event) => {
          const { rowIndex, column } = event;
          updateCellValue({
            rowId: rowIndex!,
            columnId: column.getColId(),
            value: event.data[column.getColId()],
          });
        }}
      />
    </div>
  );
}
