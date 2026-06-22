"use client";

import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Key, Loader2Icon, UserRoundPen } from "lucide-react";
import Image from "next/image";
import * as React from "react";

const ProfileCard = ({ session }: any) => {
  const [user, setUser] = React.useState<any>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [update, setUpdate] = React.useState(false);

  // Extract authToken from session
  const authToken = session?.id;

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/get-user-data`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          }
        }
      );
      if (response.ok) {
        const responseData = await response.json();
        // console.warn('🚀 ~ getModule ~ data:', responseData.data);
        // setTotalPage(() => pageCount);
        setUser(() => responseData.data);
        setIsLoading(false);
      }
      else {
        setIsLoading(true);
        console.error("fetch req failed: ", response)
      }
    } catch (error: any) {
      console.error("Error fetching user data:", error);
    }

  };

  React.useEffect(() => {
    fetchData();
  }, [update, session]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex items-center">
          <Loader2Icon className="animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>

    );
  }

  return (
    <div className="w-full h-full">
      <div className="flex w-full flex-col justify-between">
        <div className='shadow-slate-100" flex w-full flex-col items-center justify-start rounded-md border border-opacity-20 md:flex-row'>
          <div className="m-5 flex items-center justify-start">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={`${process.env.NEXT_PUBLIC_API_URL}/${user?.profile_pic}`}
                width={100}
                height={100}
                className="mx-auto mb-4 h-32 w-32 rounded-full object-cover z-0"
                alt="Profile Image"
              />
              <AvatarFallback className="rounded-lg">
                <Image
                  src="/placeholder-image.png"
                  width={500}
                  height={500}
                  alt="Placeholder"
                />
              </AvatarFallback>
            </Avatar>
          </div>
          {user && (
            <div className="flex flex-col items-center justify-center gap-1 pb-4 md:items-start md:justify-center">
              <h1 className="text-center text-2xl font-bold text-foreground/80">
                {user?.full_name}
              </h1>
              <div>
                <Badge variant="default" className="text-xs uppercase">
                  {user?.role}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className="flex my-5 w-full flex-col items-center justify-start rounded-md border border-opacity-20 shadow-slate-100">
            <div className="flex w-full justify-between sm:p-4 p-2">
              <h1 className="text-lg font-bold text-foreground">
                Information
              </h1>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <UserRoundPen className="w-7 h-7" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mr-6">
                  {/* <EditProfileDialog
                    user={user}
                    accessToken={authToken}
                    onUpdateSuccess={() => {
                      fetchData(); // Refresh data after update
                    }}
                  /> */}
                  <DropdownMenuSeparator />
                  {/* <UpdateProfilePicture
                    accessToken={authToken}
                    onUploadImage={() => {
                      fetchData(); // Refresh data after update
                    }}
                  /> */}
                  <DropdownMenuSeparator />
                  <Button
                    variant="ghost"
                    className="flex w-full justify-start items-center"
                  >
                    <Key className="font-bold" size={20} />
                    <span>Upload Image</span>
                  </Button>
                  <DropdownMenuSeparator />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex w-full flex-col sm:flex-row">
              <div className="mx-8 w-full flex md:w-1/2 flex-col">
                <div className="mb-4 flex flex-col gap-2">
                  <p>
                    <span className="text-sm font-medium leading-none">
                      Email :
                    </span>
                    <span className="text-sm font-medium leading-none text-muted-foreground">
                      {" "}
                      {user.email || "N/A"}
                    </span>
                  </p>
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <p>
                    <span className="text-sm font-medium leading-none">
                      Contact No :
                    </span>
                    <span className="text-sm font-medium leading-none text-muted-foreground">
                      {" "}
                      {user.contact || "N/A"}
                    </span>
                  </p>
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <p>
                    <span className="text-sm font-medium leading-none">
                      Joining Date :
                    </span>
                    <span className="text-sm font-medium leading-none text-muted-foreground">
                      {' '}
                      {user.joining_date ? format(new Date(user.joining_date), 'yyyy-MM-dd') : "N/A"}
                    </span>
                  </p>
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <p>
                    <span className="text-sm font-medium leading-none">
                      Present Address :
                    </span>
                    <span className="text-sm font-medium leading-none text-muted-foreground">
                      {" "}
                      {user.present_address || "N/A"}
                    </span>
                  </p>
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <p>
                    <span className="text-sm font-medium leading-none">
                      Permanent Address :
                    </span>
                    <span className="text-sm font-medium leading-none text-muted-foreground">
                      {" "}
                      {user.permanent_address || "N/A"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mx-8 w-full flex md:w-1/2 flex-col">
                <div className="mb-4 flex flex-col gap-2">
                  <p>
                    <span className="text-sm font-medium leading-none">
                      Posting Place :
                    </span>
                    <span className="text-sm font-medium leading-none text-muted-foreground">
                      {' '}
                      {user.posting_place || "N/A"}
                    </span>
                  </p>
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <p>
                    <span className="text-sm font-medium leading-none">
                      Department :
                    </span>
                    <span className="text-sm font-medium leading-none text-muted-foreground">
                      {' '}
                      {user.department_name || "N/A"}
                    </span>
                  </p>
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <p>
                    <span className="text-sm font-medium leading-none">
                      Permanent Date :
                    </span>
                    <span className="text-sm font-medium leading-none whitespace-normal text-muted-foreground">
                      {' '}
                      {user.permanent_date ? format(new Date(user.permanent_date), 'yyyy-MM-dd') : "Temporary Employee"}
                    </span>
                  </p>
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <p>
                    <span className="text-sm font-medium leading-none">
                      NID No :
                    </span>
                    <span className="text-sm font-medium leading-none text-muted-foreground">
                      {' '}
                      {user.nid_no || "N/A"}
                    </span>
                  </p>
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <p>
                    <span className="text-sm font-medium leading-none">
                      Module Name :
                    </span>
                    <span className="text-sm font-medium leading-none text-muted-foreground">
                      {' '}
                      {user.module_name || "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;