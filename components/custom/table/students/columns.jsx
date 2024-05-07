import { CellAction } from "./cell-action";
import { Checkbox } from "@/components/ui/checkbox";

export const columns = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  // {
  //   accessorKey: "rollNo",
  //   header: "ROLL NO",
  // },
  // {
  //   accessorKey: "name",
  //   header: "NAME",
  // },
  // {
  //   accessorKey: "course",
  //   header: "COURSE",
  // },
  // {
  //   accessorKey: "aggregate",
  //   header: "AGGREGATE",
  // },
  // {
  //   accessorKey: "10th",
  //   header: "10TH",
  // },
  // {
  //   accessorKey: "12th",
  //   header: "12TH",
  // },
  // {
  //   accessorKey: "liveBacklogs",
  //   header: "LIVE BACKLOGS",
  // },
  // {
  //   accessorKey: "closedBacklogs",
  //   header: "CLOSED BACKLOGS",
  // },
  // {
  //   accessorKey: "jobs",
  //   header: "JOBS",
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "roll_no",
    header: "Roll No",
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone_number",
    header: "Phone Number",
  },
  {
    accessorKey: "primary_specialization",
    header: "Specialization",
  },
  {
    accessorKey: "aggregate_cgpa",
    header: "Aggregate CGPA",
  },
  {
    accessorKey: "live_backlogs",
    header: "Live Backlogs",
  },
  {
    accessorKey: "closed_backlogs",
    header: "Closed Backlogs",
  },
  // Add more columns as needed
  // Example:
  // {
  //   accessorKey: "gender",
  //   header: "Gender",
  // },
  // {
  //   accessorKey: "disability",
  //   header: "Disability",
  // },
  // ...etc.
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];