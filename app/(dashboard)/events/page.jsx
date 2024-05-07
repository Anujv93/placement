"use client"
import { useEffect,useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import BreadCrumb from "@/components/custom/breadcrumb";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTableDemo } from "@/components/custom/table/events/student-table";
import { columns } from "@/components/custom/table/events/columns";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import EventForm from "@/components/forms/eventForm";

const breadcrumbItems = [{ title: "Hotels", link: "/dashboard/hotels" }];


export default function Events() {
  const [students, setStudents] = useState([]);
  const supabase = createClient();
  useEffect(() => {
    async function fetchStudents() {
      try {
        const { data, error } = await supabase.from('events').select('*');
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
            title={`Events (${len})`}
            description="Manage hotels (Server side table functionalities.)"
          />
          <Dialog className="w-full">
      <DialogTrigger asChild>
        <Button ><Plus className="mr-2 h-4 w-4" /> Add New</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90%] lg:max-w-screen-lg overflow-y-scroll max-h-[90%] ">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <EventForm/>
      </DialogContent>
    </Dialog>
        </div>
        <Separator />
        <DataTableDemo columns={columns} data={students}/>
      </div>
    </>
  );
}
