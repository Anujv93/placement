"use client"
import { useEffect,useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import BreadCrumb from "@/components/custom/breadcrumb";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTableDemo } from "@/components/custom/table/students/student-table";
import { columns } from "@/components/custom/table/students/columns";
import { createClient } from "@/utils/supabase/client";

const breadcrumbItems = [{ title: "Hotels", link: "/dashboard/hotels" }];


export default function Students() {
  const [students, setStudents] = useState([]);
  const supabase = createClient();
  useEffect(() => {
    async function fetchStudents() {
      try {
        const { data, error } = await supabase.from('students').select('*');
        console.log(data )
        if (error) {
          throw error;
        }
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error.message);
      }
    }
    fetchStudents();
  }, []);
  const len = students.length;
  return (
    <>
<div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Students (${len})`}
            description="Manage hotels (Server side table functionalities.)"
          />

          <Link
            href={"/dashboard/hotels/addNew"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link>
        </div>
        <Separator />
        <DataTableDemo columns={columns} data={students}/>
      </div>
    </>
  );
}
