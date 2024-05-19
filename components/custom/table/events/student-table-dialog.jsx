
"use client"
import React from 'react'
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTableDemo } from "@/components/custom/table/events/student-table";
import { createClient } from "@/utils/supabase/client";
import { columns as studentColumns } from "@/components/custom/table/events/student-columns"; // Create columns for student table



export default function StudentTableDialog({ isOpen, onClose, event }) {
  const [students, setStudents] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStudents() {
      if (!event) return;
      try {
        const { data, error } = await supabase
          .from('event_applications')
          .select('student_id, students(*)')
          .eq('event_id', event.id);
        if (error) {
          throw error;
        }
        setStudents(data.map(application => application.students));
      } catch (error) {
        console.error('Error fetching students:', error.message);
      }
    }
    fetchStudents();
  }, [event]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[90%] lg:max-w-screen-lg overflow-y-scroll max-h-[90%]">
        <DialogHeader>
          <DialogTitle>Students for {event?.event_title}</DialogTitle>
        </DialogHeader>
        <DataTableDemo columns={studentColumns} data={students} />
      </DialogContent>
    </Dialog>
  );
}
