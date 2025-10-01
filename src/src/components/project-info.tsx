// // src/components/ProjectInfo.tsx
// "use client";
//
// import { useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { FolderOpen } from "lucide-react";
// import Link from "next/link";
//
// interface ProjectInfoProps {
//   projectId: string;
// }
//
// export function ProjectInfo({ projectId }: ProjectInfoProps) {
//   const { project, isLoading } = useProjectById(projectId);
//
//   if (isLoading) {
//     return <div>Loading project info...</div>;
//   }
//
//   if (!project) {
//     return null;
//   }
//
//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "done":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
//       case "in_progress":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
//     }
//   };
//
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center space-x-2">
//           <FolderOpen className="h-5 w-5 text-primary"/>
//           <span>Project</span>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           <Link
//             href={`/projects/${project.id}`}
//             className="block hover:bg-muted/50 p-2 rounded-md transition-colors"
//           >
//             <div className="flex items-center space-x-3">
//               <div className="w-3 h-3 rounded-full"
//                    style={{backgroundColor: project.color || "#6b7280"}}/>
//               <div>
//                 <p className="font-medium">{project.name}</p>
//                 <p className="text-sm text-muted-foreground">{project.description}</p>
//               </div>
//             </div>
//           </Link>
//           <Badge
//             className={getStatusColor(project.status)}>{project.status.replace("_", " ")}</Badge>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }