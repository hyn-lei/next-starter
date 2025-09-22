"use client";
import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { redirect, useRouter } from "next/navigation";
import { ArrowRight, AlertTriangle, CrownIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const { user } = useUser();
  const t = useTranslations("userNav");
  const router = useRouter();
  const { signOut } = useClerk();
  const [isDeleting, setIsDeleting] = useState(false);

  // Redirect to sign-in if not authenticated
  if (!user) {
    redirect("/sign-in");
  }

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      // In a real application, you would call the API to delete the account data here
      await user?.delete();
      // Sign out
      await signOut();
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      setIsDeleting(false);
    }
  };

  const fullName = user.fullName || user.username || t("user");
  const email = user.emailAddresses?.[0]?.emailAddress || "";
  const initials = fullName
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();
  const createdAt = user?.createdAt
    ? format(new Date(user.createdAt), "PPP")
    : "";

  // Membership status - currently defaults to free
  const membershipStatus = "free";

  return (
    <div className="space-y-8">
      {/* Hero header */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 py-8 px-6 rounded-lg border border-border/30">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-background shadow-sm">
            <AvatarImage src={user.imageUrl} alt={fullName} />
            <AvatarFallback className="text-2xl bg-primary/10">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{fullName}</h1>
              <Badge
                variant="outline"
                className="bg-primary/5 text-primary border-primary/20"
              >
                {t("membershipFree")}
              </Badge>
            </div>
            <p className="text-muted-foreground">{email}</p>
            <p className="text-sm text-muted-foreground">
              {t("memberSince")}: {createdAt}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("accountOverview")}</CardTitle>
            <CardDescription>{t("accountInfo")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("email")}
                  </p>
                  <p>{email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("name")}
                  </p>
                  <p>{fullName}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-medium">
                      {t("currentPlan")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t("freePlanDescription")}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-primary/5 text-primary border-primary/20"
                  >
                    {t("membershipFree")}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-4 border-t">
            <div className="w-full">
              <p className="text-sm text-muted-foreground mb-2">
                {t("dataManagement")}
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto flex items-center gap-2 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:border-red-700 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("deleteAccount")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      {t("deleteAccountConfirmTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("deleteAccountConfirmDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? t("deleting") : t("confirmDelete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardFooter>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>{t('quickActions')}</CardTitle>
            <CardDescription>{t('commonTasks')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-between">
              <Link href="/#converter">
                {t('startConverting')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
