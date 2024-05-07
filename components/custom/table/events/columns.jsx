
import { Checkbox } from "@/components/ui/checkbox";
export const columns = [
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
    { accessorKey: "event_title", header: "Event Title" },
    { accessorKey: "organisation_name", header: "Organisation Name" },
    { accessorKey: "eligible_courses", header: "Eligible Courses" },
    { accessorKey: "eligibility_criteria", header: "Eligibility Criteria" },
    { accessorKey: "selection_process_details", header: "Selection Process Details" },
    { accessorKey: "other_details", header: "Other Details" },
    { accessorKey: "contact_persons", header: "Contact Persons" },
    { accessorKey: "expected_openings", header: "Expected Openings" },
    { accessorKey: "company_person_contact", header: "Company Person Contact" },
    { accessorKey: "job_title", header: "Job Title" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "job_details", header: "Job Details" },
    { accessorKey: "ctc", header: "CTC" },
];
