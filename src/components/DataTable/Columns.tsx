import { TableColumn } from "react-data-table-component";

interface ListRow {
  customer_id: number;
  total_call_same_continent: string | number;
  total_duration_same_continent: string | number;
  total_call: string | number;
  total_duration: string | number;
}

export const List: TableColumn<ListRow>[] = [
  {
    name: "Customer ID",
    selector: (row: ListRow) => row.customer_id,
  },
  {
    name: "Total Calls Same Continent",
    selector: (row: ListRow) => row.total_call_same_continent ?? 0,
  },
  {
    name: "Total Duration Same Continent",
    selector: (row: ListRow) => row.total_duration_same_continent ?? 0,
  },
  {
    name: "Total Calls",
    selector: (row: ListRow) => row.total_call ?? 0,
  },
  {
    name: "Total Duration",
    selector: (row: ListRow) => row.total_duration ?? 0,
  },
];
