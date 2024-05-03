"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "../icons";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useState } from "react";

// interface DashboardNavProps {
//   items: MainNavItem[];
//   setOpen?: Dispatch<SetStateAction<boolean>>;
// }

// export function DashboardNav({ items, setOpen }: DashboardNavProps) {
//   const path = usePathname();

//   if (!items?.length) {
//     return null;
//   }
//   return (
//     <nav className="grid items-start gap-2">
//       {items.map((item, index) => {
//         const Icon = Icons[item.icon || "arrowRight"];
//         const DropDownIcon = Icons["arrowDown"];
//         return (
//           item.items && (
//             <Link
//               href="#"
//               onClick={() => {
//                 if (setOpen) setOpen(false);
//               }}
//             >
//               <span
//                 className={cn(
//                   "group flex flex-row items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
//                   path === item.href ? "bg-accent" : "transparent",
//                   item.disabled && "cursor-not-allowed opacity-80",
//                 )}
//               >
//                 <Icon className="mr-2 h-4 w-4" />
//                 <span className="flex-1">{item.title}</span>
//                 <DropDownIcon className="ml-auto h-4 w-4" />
//               </span>
//             </Link>
//           )
//         );
//         // item.href && (
//         //   <Link
//         //     key={index}
//         //     href={item.disabled ? "/" : item.href}
//         //     onClick={() => {
//         //       if (setOpen) setOpen(false);
//         //     }}
//         //   >
//         //     <span
//         //       className={cn(
//         //         "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
//         //         path === item.href ? "bg-accent" : "transparent",
//         //         item.disabled && "cursor-not-allowed opacity-80",
//         //       )}
//         //     >
//         //       <Icon className="mr-2 h-4 w-4" />
//         //       <span>{item.title}</span>
//         //     </span>
//         //   </Link>
//         // )
//       })}
//     </nav>
//   );
// }
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// import { Icons } from "@/components/icons";
// import { cn } from "@/lib/utils";
// import { MainNavItem, NavItem } from "@/types";
// import { Dispatch, SetStateAction } from "react";

// interface DashboardNavProps {
//   items: MainNavItem[];
//   setOpen?: Dispatch<SetStateAction<boolean>>;
// }

// export function DashboardNav({ items, setOpen }: DashboardNavProps) {
//   const path = usePathname();

//   if (!items?.length) {
//     return null;
//   }

//   const renderNavItem = (item: MainNavItem, index: number) => {
//     const Icon = Icons[item.icon || "arrowRight"];
//     const DropDownIcon = Icons["arrowDown"];

//     return (
//       <div key={index}>
//         <Link
//           href="#"
//           onClick={() => {
//             if (setOpen) setOpen(false);
//           }}
//         >
//           <span
//             className={cn(
//               "group flex flex-row items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
//               path === item.href ? "bg-accent" : "transparent",
//               item.disabled && "cursor-not-allowed opacity-80",
//             )}
//           >
//             <Icon className="mr-2 h-4 w-4" />
//             <span className="flex-1">{item.title}</span>
//             {item.items && <DropDownIcon className="ml-auto h-4 w-4" />}
//           </span>
//         </Link>
//         {item.items && (
//           <div className="ml-6">
//             {item.items.map((subItem, subIndex) => (
//               <Link
//                 key={subIndex}
//                 href={subItem.disabled ? "/" : "/a"}
//                 onClick={() => {
//                   if (setOpen) setOpen(false);
//                 }}
//               >
//                 <span
//                   className={cn(
//                     "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
//                     path === subItem.href ? "bg-accent" : "transparent",
//                     subItem.disabled && "cursor-not-allowed opacity-80",
//                   )}
//                 >
//                   <Icon className="mr-2 h-4 w-4" />
//                   <span>{subItem.title}</span>
//                 </span>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <nav className="grid items-start gap-2">{items.map(renderNavItem)}</nav>
//   );
// }


export function DashboardNav({ items, setOpen }) {
  const path = usePathname();

  if (!items?.length) {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openSubmenus, setOpenSubmenus] = useState([]);

  const handleDropdownToggle = (index) => {
    if (openSubmenus.includes(index)) {
      setOpenSubmenus(openSubmenus.filter((item) => item !== index)); // Close the submenu if it's already open
    } else {
      setOpenSubmenus([...openSubmenus, index]); // Open the submenu
    }
  };

  const isSubmenuOpen = (index) => openSubmenus.includes(index);

  const renderNavItem = (item, index) => {
    const Icon = Icons[item.icon || "arrowRight"];
    const DropDownIcon = Icons["arrowDown"];
    const UpIcon = Icons["arrowUp"];

    return (
      <div key={index}>
        <Link
          href={item.href ?? "#"}
          onClick={() => {
            handleDropdownToggle(index);
            if (setOpen) setOpen(false);
          }}
        >
          <span
            className={cn(
              "group flex flex-row items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              path === item.href ? "bg-accent" : "transparent",
              item.disabled && "cursor-not-allowed opacity-80",
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span className="flex-1">{item.title}</span>
            {item.items &&
              (isSubmenuOpen(index) ? (
                <UpIcon className="ml-auto h-4 w-4" />
              ) : (
                <DropDownIcon className="ml-auto h-4 w-4" />
              ))}
          </span>
        </Link>
        {item.items && isSubmenuOpen(index) && (
          <div className="ml-6">
            {item.items.map(
              (subItem, subIndex) =>
                subItem.href && (
                  <Link
                    key={subIndex}
                    href={subItem.disabled ? "/" : subItem.href}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    <span
                      className={cn(
                        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        path === subItem.href ? "bg-accent" : "transparent",
                        subItem.disabled && "cursor-not-allowed opacity-80",
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{subItem.title}</span>
                    </span>
                  </Link>
                ),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="grid items-start gap-2">{items.map(renderNavItem)}</nav>
  );
}
