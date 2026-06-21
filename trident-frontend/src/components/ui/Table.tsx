import tableStyles from "./Table.module.css";

type TableColumn<T extends object> = {
  header: string;
  key: keyof T;
};

type TableProps<T extends object> = {
  columns: TableColumn<T>[];
  rows: T[];
};

export function Table<T extends object>({
  columns,
  rows,
}: TableProps<T>): JSX.Element {
  return (
    <table className={tableStyles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={String(column.key)}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column) => (
              <td key={String(column.key)}>{String(row[column.key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
