// import { useForm } from "@refinedev/react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { EditView } from "@/components/refine-ui/views/edit-view"; // confirm this exists in refine-ui
// import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
// import { useBack, useList } from "@refinedev/core";
// import { Loader2 } from "lucide-react";
// import { classSchema } from "@/lib/schema";
// import z from "zod";
// import { Textarea } from "@/components/ui/textarea";
// import UploadWidget from "@/components/upload-widget";
// import { Subject, User } from "@/types";
// import { useEffect } from "react";

// const ClassesEdit = () => {
//   const back = useBack();

//   const form = useForm({
//     resolver: zodResolver(classSchema),
//     refineCoreProps: {
//       resource: "classes",
//       action: "edit",
//     },
//   });

//   const {
//     refineCore: { onFinish, query },
//     handleSubmit,
//     formState: { isSubmitting, errors },
//     control,
//     reset,
//   } = form;

//   useEffect(() => {
//     const record = query?.data?.data;
//     if (record) {
//       reset({
//         name: record.name,
//         description: record.description,
//         subjectId: record.subjectId,
//         teacherId: record.teacherId,
//         capacity: record.capacity,
//         status: record.status,
//         bannerUrl: record.bannerUrl,
//         bannerCldPubId: record.bannerCldPubId,
//       });
//     }
//   }, [query?.data, reset]);

//   console.log("Current errors:", errors);
//   console.log("Current values:", form.getValues());

//   const isLoadingRecord = query?.isLoading;

//   const onSubmit = async (values: z.infer<typeof classSchema>) => {
//     console.log("onSubmit fired with:", values); // ADD THIS
//     try {
//       await onFinish(values);
//     } catch (error) {
//       console.error("Error updating class:", error);
//     }
//   };

//   const { query: subjectsQuery } = useList<Subject>({
//     resource: "subjects",
//     pagination: { pageSize: 100 },
//   });

//   const { query: teachersQuery } = useList<User>({
//     resource: "users",
//     filters: [{ field: "role", operator: "eq", value: "teacher" }],
//     pagination: { pageSize: 100 },
//   });

//   const teachers = teachersQuery.data?.data || [];
//   const teachersLoading = teachersQuery.isLoading;

//   const subjects = subjectsQuery.data?.data || [];
//   const subjectsLoading = subjectsQuery.isLoading;

//   const bannerPublicId = form.watch("bannerCldPubId");

//   const setBannerImage = (file: any, field: any) => {
//     if (file) {
//       field.onChange(file.url);
//       form.setValue("bannerCldPubId", file.publicId, {
//         shouldValidate: true,
//         shouldDirty: true,
//       });
//     } else {
//       field.onChange("");
//       form.setValue("bannerCldPubId", "", {
//         shouldValidate: true,
//         shouldDirty: true,
//       });
//     }
//   };

//   if (isLoadingRecord) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <Loader2 className="animate-spin" />
//       </div>
//     );
//   }

//   return (
//     <EditView className="class-view">
//       <Breadcrumb />

//       <h1 className="page-title">Edit Class</h1>
//       <div className="intro-row">
//         <p>Update the class details below.</p>
//         <Button onClick={() => back()}>Go Back</Button>
//       </div>

//       <Separator />

//       <div className="my-4 flex items-center">
//         <Card className="class-form-card">
//           <CardHeader className="relative z-10">
//             <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
//               Update form
//             </CardTitle>
//           </CardHeader>

//           <Separator />

//           <CardContent className="mt-7">
//             <Form {...form}>
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//                 <FormField
//                   control={control}
//                   name="bannerUrl"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Banner Image <span className="text-orange-600">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <UploadWidget
//                           value={
//                             field.value
//                               ? {
//                                   url: field.value,
//                                   publicId: bannerPublicId ?? "",
//                                 }
//                               : null
//                           }
//                           onChange={(file: any) => setBannerImage(file, field)}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Class Name <span className="text-orange-600">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <FormField
//                     control={control}
//                     name="subjectId"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Subject <span className="text-orange-600">*</span>
//                         </FormLabel>
//                         <Select
//                           onValueChange={(value) =>
//                             field.onChange(Number(value))
//                           }
//                           //   value={field.value?.toString()}
//                           value={field.value ? field.value.toString() : ""}
//                           disabled={subjectsLoading}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select a subject" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {subjects.map((subject) => (
//                               <SelectItem
//                                 key={subject.id}
//                                 value={subject.id.toString()}
//                               >
//                                 {subject.name} ({subject.code})
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={control}
//                     name="teacherId"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Teacher <span className="text-orange-600">*</span>
//                         </FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           //   value={field.value?.toString()}
//                           value={field.value ? field.value.toString() : ""}
//                           disabled={teachersLoading}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select a teacher" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {teachers.map((teacher) => (
//                               <SelectItem key={teacher.id} value={teacher.id}>
//                                 {teacher.name}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <div className="grid sm:grid-cols-2 gap-4">
//                   <FormField
//                     control={control}
//                     name="capacity"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Capacity <span className="text-orange-600">*</span>
//                         </FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             min={1}
//                             onChange={(e) => {
//                               const value = e.target.value;
//                               field.onChange(value ? Number(value) : undefined);
//                             }}
//                             value={(field.value as number | undefined) ?? ""}
//                             name={field.name}
//                             ref={field.ref}
//                             onBlur={field.onBlur}
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={control}
//                     name="status"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>
//                           Status <span className="text-orange-600">*</span>
//                         </FormLabel>
//                         <Select
//                           onValueChange={field.onChange}
//                           value={field.value}
//                         >
//                           <FormControl>
//                             <SelectTrigger className="w-full">
//                               <SelectValue placeholder="Select status" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             <SelectItem value="active">Active</SelectItem>
//                             <SelectItem value="inactive">Inactive</SelectItem>
//                           </SelectContent>
//                         </Select>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <FormField
//                   control={control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>
//                         Description <span className="text-orange-600">*</span>
//                       </FormLabel>
//                       <FormControl>
//                         <Textarea {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <Separator />

//                 <Button type="submit" size="lg" className="w-full">
//                   {isSubmitting ? (
//                     <div className="flex gap-1">
//                       <span>Updating Class...</span>
//                       <Loader2 className="inline-block ml-2 animate-spin" />
//                     </div>
//                   ) : (
//                     "Update Class"
//                   )}
//                 </Button>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>
//       </div>
//     </EditView>
//   );
// };

// export default ClassesEdit;

import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { EditView } from "@/components/refine-ui/views/edit-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { useGo, useList } from "@refinedev/core";
import { Loader2 } from "lucide-react";
import { classSchema } from "@/lib/schema";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import UploadWidget from "@/components/upload-widget";
import { Subject, User } from "@/types";
import { useEffect } from "react";

const ClassesEdit = () => {
  const go = useGo();

  const handleBack = () => {
    go({ to: "/classes" });
  };

  const form = useForm({
    resolver: zodResolver(classSchema),
    refineCoreProps: {
      resource: "classes",
      action: "edit",
    },
  });

  const {
    refineCore: { onFinish, query },
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    reset,
  } = form;

  const { query: subjectsQuery } = useList<Subject>({
    resource: "subjects",
    pagination: { pageSize: 100 },
  });

  const { query: teachersQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "teacher" }],
    pagination: { pageSize: 100 },
  });

  const teachers = teachersQuery.data?.data || [];
  const teachersLoading = teachersQuery.isLoading;

  const subjects = subjectsQuery.data?.data || [];
  const subjectsLoading = subjectsQuery.isLoading;

  const isLoadingRecord = query?.isLoading;

  // Only reset the form once the class record itself has loaded.
  // We gate rendering below on subjects/teachers too, so by the time
  // this form is actually shown, all three data sources are ready.
  useEffect(() => {
    const record = query?.data?.data;
    if (record) {
      reset({
        name: record.name,
        description: record.description,
        subjectId: record.subjectId,
        teacherId: record.teacherId,
        capacity: record.capacity,
        status: record.status,
        bannerUrl: record.bannerUrl,
        bannerCldPubId: record.bannerCldPubId,
      });
    }
  }, [query?.data, reset]);

  const onSubmit = async (values: z.infer<typeof classSchema>) => {
    try {
      await onFinish(values);
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  const bannerPublicId = form.watch("bannerCldPubId");

  const setBannerImage = (file: any, field: any) => {
    if (file) {
      field.onChange(file.url);
      form.setValue("bannerCldPubId", file.publicId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      field.onChange("");
      form.setValue("bannerCldPubId", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  if (isLoadingRecord || subjectsLoading || teachersLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <EditView className="class-view">
      <Breadcrumb />

      <h1 className="page-title">Edit Class</h1>
      <div className="intro-row">
        <p>Update the class details below.</p>
        <Button onClick={handleBack}>Go Back</Button>
      </div>

      <Separator />

      <div className="my-4 flex items-center">
        <Card className="class-form-card">
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl pb-0 font-bold text-gradient-orange">
              Update form
            </CardTitle>
          </CardHeader>

          <Separator />

          <CardContent className="mt-7">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={control}
                  name="bannerUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Banner Image <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <UploadWidget
                          value={
                            field.value
                              ? {
                                  url: field.value,
                                  publicId: bannerPublicId ?? "",
                                }
                              : null
                          }
                          onChange={(file: any) => setBannerImage(file, field)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Class Name <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Subject <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            if (value) field.onChange(Number(value));
                          }}
                          value={field.value ? field.value.toString() : ""}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a subject" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem
                                key={subject.id}
                                value={subject.id.toString()}
                              >
                                {subject.name} ({subject.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Teacher <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            if (value) field.onChange(value);
                          }}
                          value={field.value ? field.value.toString() : ""}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Capacity <span className="text-orange-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value ? Number(value) : undefined);
                            }}
                            value={(field.value as number | undefined) ?? ""}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Status <span className="text-orange-600">*</span>
                        </FormLabel>
                        <Select
                          onValueChange={(value) => {
                            if (value) field.onChange(value);
                          }}
                          value={field.value ?? ""}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-orange-600">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                <Button type="submit" size="lg" className="w-full">
                  {isSubmitting ? (
                    <div className="flex gap-1">
                      <span>Updating Class...</span>
                      <Loader2 className="inline-block ml-2 animate-spin" />
                    </div>
                  ) : (
                    "Update Class"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </EditView>
  );
};

export default ClassesEdit;
