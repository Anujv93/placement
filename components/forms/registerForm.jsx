// "use client";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
// import { Input } from "../ui/input";
// import { Button } from "../ui/button";
// import { signup } from "@/utils/auth/action";
// import { toast } from "sonner";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// export const registerSchema = z.object({
//   firstName: z.string(),
//   middleName: z.string(),
//   lastName: z.string(),
//   email: z.string().email({ message: "Invalid email address" }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
//   confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters long" }),
//   rollNo: z.string(),
//   courseCompletionYear: z.number(),
//   campus: z.string(),
// });

// const RegistrationForm = () => {
//   const form = useForm({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       firstName: "",
//       middleName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       rollNo: "",
//       courseCompletionYear: "",
//       campus: "",
//     },
//   });

//   async function onSubmit(values) {
//     const error = await signup(values);
//     if (error) {
//       toast(error, "error");
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="firstName"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>First Name</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//          <FormField
//           control={form.control}
//           name="middleName"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Middle Name</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
         
//         <FormField
//           control={form.control}
//           name="lastName"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Last Name</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
        
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input type="password" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="confirmPassword"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Confirm Password</FormLabel>
//               <FormControl>
//                 <Input type="password" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="rollNo"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Roll No.</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="courseCompletionYear"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Course Completion Year</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//        <FormField
//   control={form.control}
//   name="campus"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Campus</FormLabel>
//       <FormControl>
//         <Select {...field}>
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Select Campus" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="campus1">Campus 1</SelectItem>
//             <SelectItem value="campus2">Campus 2</SelectItem>
//             <SelectItem value="campus3">Campus 3</SelectItem>
//           </SelectContent>
//         </Select>
//       </FormControl>
//       <FormMessage />
//     </FormItem>
//   )}
// />
//         <Button type="submit">Register</Button>
//       </form>
//     </Form>
//   );
// };

// export default RegistrationForm;
"use client";

import { z } from "zod";
import { useForm, useStep } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useState } from "react";

const userInfoSchema = z.object({
  firstName: z.string().min(3,{ message: "First name is required" }),
  lastName: z.string().min(1,{ message: "Last name is required" }),
});

const accountInfoSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const steps = [
  { id: "userInfo", validationSchema: userInfoSchema },
  { id: "accountInfo", validationSchema: accountInfoSchema },
];

const MultiStepForm = () => {
 const [currentStep, setCurrentStep] = useState(0);
  const form = useForm({
    resolver: zodResolver(steps[currentStep].validationSchema),
  });

  const onSubmit = async (values) => {
    if (currentStep === steps.length - 1) {
    //   const error = await login(values);
      if (values) {
        toast(JSON.stringify(values),);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

 return (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {steps[currentStep].id === "userInfo" && (
        <>
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      {steps[currentStep].id === "accountInfo" && (
        <>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      <Button type="submit">{currentStep === steps.length - 1 ? "Submit" : "Next"}</Button>
    </form>
  </Form>
);
};

export default MultiStepForm;