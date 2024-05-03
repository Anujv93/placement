import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const MyInput = React.forwardRef(function InputBox({label, type,...props}, ref){
    return (
         <div> 
      <div className="flex flex-col space-y-1.5">
              <Label htmlFor={label}>{label}</Label>
            <Input type={type} id="name" ref={ref} {...props}/>
          </div>
              </div>)
})


//  return (
//     <div> 
//         <div className="flex flex-col space-y-1.5">
//                 <Label htmlFor="name">{label}</Label>
//                  <Input type={type} id="name" ref={ref}/>
//               </div>
//               </div>
//   )

export default MyInput;