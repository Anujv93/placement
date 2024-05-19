// "use client"
// import { useEffect,useState } from "react";
// import { Heading } from "@/components/ui/heading";
// import { Separator } from "@/components/ui/separator";
// import Link from "next/link";
// import BreadCrumb from "@/components/custom/breadcrumb";
// import { cn } from "@/lib/utils";
// import { buttonVariants } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { DataTableDemo } from "@/components/custom/table/events/student-table";
// import { columns } from "@/components/custom/table/events/columns";
// import { createClient } from "@/utils/supabase/client";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import EventForm from "@/components/forms/eventForm";

// const breadcrumbItems = [{ title: "Events", link: "/events" }];


// export default function Events() {
//   const [students, setStudents] = useState([]);
//   const supabase = createClient();
//   useEffect(() => {
//     async function fetchStudents() {
//       try {
//         const { data, error } = await supabase.from('events').select('*');
//         console.log(data )
//         if (error) {
//           throw error;
//         }
//         setStudents(data);
//       } catch (error) {
//         console.error('Error fetching students:', error.message);
//       }
//     }
//     fetchStudents();
//   }, []);
//   const len = students.length;
//   return (
//     <>
// <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
//         <BreadCrumb items={breadcrumbItems} />
//         <div className="flex items-start justify-between">
//           <Heading
//             title={`Events (${len})`}
//             description="Manage hotels (Server side table functionalities.)"
//           />
//           <Dialog className="w-full">
//       <DialogTrigger asChild>
//         <Button ><Plus className="mr-2 h-4 w-4" /> Add New</Button>
//       </DialogTrigger>
//       <DialogContent className="min-w-[90%] lg:max-w-screen-lg overflow-y-scroll max-h-[90%] ">
//         <DialogHeader>
//           <DialogTitle>Create Event</DialogTitle>
//         </DialogHeader>
//         <EventForm/>
//       </DialogContent>
//     </Dialog>
//         </div>
//         <Separator />
//         <DataTableDemo columns={columns} data={students}/>
//       </div>
//     </>
//   );
// }
"use client"
import { useEffect, useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EventForm from "@/components/forms/eventForm";
import StudentTableDialog from "@/components/custom/table/events/student-table-dialog"; // Import the new component

const breadcrumbItems = [{ title: "Events", link: "/events" }];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase.from('events').select('*');
        if (error) {
          throw error;
        }
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error.message);
      }
    }
    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const len = events.length;

  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Events (${len})`}
            description="Manage hotels (Server side table functionalities.)"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add New</Button>
            </DialogTrigger>
            <DialogContent className="min-w-[90%] lg:max-w-screen-lg overflow-y-scroll max-h-[90%] ">
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
              </DialogHeader>
              <EventForm />
            </DialogContent>
          </Dialog>
        </div>
        <Separator />
        <DataTableDemo columns={columns} data={events} onRowClick={handleEventClick} />
      </div>
      {selectedEvent && (
        <StudentTableDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          event={selectedEvent}
        />
      )}
    </>
  );
}
