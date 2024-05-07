// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "../ui/form";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { useState } from "react"; // Import useState to manage form state
// import { toast } from "sonner"; // Assuming this is for displaying notifications

// // Define Zod schema for the form
// const formSchema = z.object({
//   eventTitle: z.string().nonempty(),
//   organisationName: z.string().nonempty(),
//   eligibleCourses: z.string().nonempty(),
//   eligibilityCriteria: z.string().nonempty(),
//   selectionProcessDetails: z.string().nonempty(),
//   otherDetails: z.string().nonempty(),
//   contactPersons: z.string().nonempty(),
//   expectedOpenings: z.number().min(0),
//   companyPersonContact: z.string().email(),
// });

// const EventForm = () => {
//   const [submitting, setSubmitting] = useState(false); // State to track form submission

//   const form = useForm({
//         resolver: zodResolver(formSchema),
//     })

//   const onSubmit = async (data) => {
//     try {
//       setSubmitting(true); // Set submitting state to true while processing form submission
//       // Add your form submission logic here
//       console.log(data); // Example: Log form data
//       // Display success message
//       toast("Form submitted successfully", "success");
//     } catch (error) {
//       // Handle submission errors
//       console.error("Error submitting form:", error);
//       toast("Error submitting form", "error");
//     } finally {
//       setSubmitting(false); // Reset submitting state after form submission
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         {/* Event Title */}
//         <FormField control={form.control} name="eventTitle" render={({ field }) => (
//             <FormItem>
//           <FormLabel>Event Title</FormLabel>
//           <FormControl>
//             <Input {...field} />
//           </FormControl>
//           <FormMessage/>
//         </FormItem>
//         )}
//         />

//         {/* Organisation Name */}
//         <FormField control={form.control} name="organisationName" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Organisation Name</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage/>
//           </FormItem>
//         )} />

//         {/* Eligible Courses */}
//         <FormField control={form.control} name="eligibleCourses" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Eligible Courses</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage/>
//           </FormItem>
//         )} />

//         {/* Eligibility Criteria */}
//         <FormField control={form.control} name="eligibilityCriteria" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Eligibility Criteria</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage/>
//           </FormItem>
//         )} />

//         {/* Selection Process Details */}
//         <FormField control={form.control} name="selectionProcessDetails" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Selection Process Details</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage/>
//           </FormItem>
//         )} />

//         {/* Other Details */}
//         <FormField control={form.control} name="otherDetails" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Other Details</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage/>
//           </FormItem>
//         )} />

//         {/* Contact Persons */}
//         <FormField control={form.control} name="contactPersons" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Contact Persons</FormLabel>
//             <FormControl>
//               <Input {...field} />
//             </FormControl>
//             <FormMessage/>
//           </FormItem>
//         )} />

//         {/* Expected Openings */}
//         <FormField control={form.control} name="expectedOpenings" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Expected Openings</FormLabel>
//             <FormControl>
//               <Input type="number" {...field} />
//             </FormControl>
//             <FormMessage/>
//           </FormItem>
//         )} />

//         {/* Company Person Contact */}
//         <FormField control={form.control} name="companyPersonContact" render={({ field }) => (
//           <FormItem>
//             <FormLabel>Company Person Contact</FormLabel>
//             <FormControl>
//               <Input type="email" {...field} />
//             </FormControl>
//             <FormMessage/>
//           </FormItem>
//         )} />

//         {/* Submit Button */}
//         <Button type="submit" disabled={submitting}>
//           {submitting ? "Submitting..." : "Submit"}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default EventForm;
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react"; // Import useState to manage form state
import { toast } from "sonner"; // Assuming this is for displaying notifications
import { TextArea } from "../ui/textarea";
import { createClient } from "@/utils/supabase/client";
// Define Zod schema for the form
const formSchema = z.object({
  event_title: z.string().nonempty(),
  organisation_name: z.string().nonempty(),
  eligible_courses: z.string().nonempty(),
  eligibility_criteria: z.string().nonempty(),
  selection_process_details: z.string().nonempty(),
  other_details: z.string().nonempty(),
  contact_persons: z.string().nonempty(),
  expected_openings: z.string(),
  company_person_contact: z.string().email(),
  job_title: z.string().nonempty(), // Added for step 2
  description: z.string().nonempty(), // Added for step 2
  job_details: z.string().nonempty(), // Added for step 2
  ctc: z.string().nonempty() 
});

const EventForm = () => {
    const supabase = createClient();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm({
    mode: "onBlur",
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      console.log(data);
      const { error } = await supabase.from('events').insert(data);
      
      if (error) {
        toast (error.message, "error");
        throw error;
      }
      toast("Form submitted successfully", "success");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast("Error submitting form", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const isLastStep = step === 2;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {step === 1 && (
          <>
            <FormField control={form.control} name="event_title" render={({ field }) => (
              <FormItem>
                <FormLabel>Event Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="organisation_name" render={({ field }) => (
              <FormItem>
                <FormLabel>Organisation Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="eligible_courses" render={({ field }) => (
              <FormItem>
                <FormLabel>Eligible Courses</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="eligibility_criteria" render={({ field }) => (
              <FormItem>
                <FormLabel>Eligibility Criteria</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
<FormField control={form.control} name="selection_process_details" render={({ field }) => (
              <FormItem>
                <FormLabel>Selection Process Details</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="other_details" render={({ field }) => (
              <FormItem>
                <FormLabel>Other Details</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />


            <FormField control={form.control} name="contact_persons" render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Persons</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="expected_openings" render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Openings</FormLabel>
                <FormControl>
                  <Input  {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="company_person_contact" render={({ field }) => (
              <FormItem>
                <FormLabel>Company Person Contact</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </>
        )}
        {step === 2 && (
          <>
           <FormField control={form.control} name="job_title" render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

<FormField control={form.control} name="job_details" render={({ field }) => (
              <FormItem>
                <FormLabel>Other Details</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="ctc" render={({ field }) => (
              <FormItem>
                <FormLabel>CTC</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} /> 
            
          </>
        )}
{step > 1 && (
          <Button onClick={handlePreviousStep}>Previous</Button>
        )}
        {!isLastStep && (
          <Button type="button" onClick={handleNextStep}>Next</Button>
        )}
        {isLastStep && (
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default EventForm;
