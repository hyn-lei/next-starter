import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, ArrowRight, Settings, Coins } from "lucide-react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { I18nLink } from "./i18n-link";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

export default function UserNav() {
  const { isSignedIn, user } = useUser();
  const { resolvedTheme } = useTheme();
  const t = useTranslations("userNav");

  if (!isSignedIn) {
    return (
      <SignInButton
        mode="modal"
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
          elements: {
            rootBox: "rounded-lg shadow-xl",
            formButtonPrimary: "bg-primary hover:bg-primary/90",
          },
        }}
      >
        <Button
          size="sm"
          className="px-4 font-medium bg-primary hover:bg-primary/90"
        >
          {t("signIn")}
        </Button>
      </SignInButton>
    );
  }

  const fullName = user?.fullName || user?.username || t("user");
  const email = user?.emailAddresses?.[0]?.emailAddress || "";
  const initials = fullName
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Avatar className="h-9 w-9 border-2 border-primary/10 hover:border-primary/50 transition-all duration-200 ring-offset-background">
            <AvatarImage
              src={user?.imageUrl || ""}
              alt={fullName}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2 mb-2">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage
              src={user?.imageUrl || ""}
              alt={fullName}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground truncate max-w-[180px]">
              {email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-1" />

        <div className="p-1 space-y-1">
          <DropdownMenuItem
            asChild
            className="cursor-pointer flex h-9 items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
          >
            <I18nLink
              href="/profile"
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-primary/70" />
                <span>{t("profile")}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </I18nLink>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="cursor-pointer flex h-9 items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
          >
            <I18nLink
              href="/profile/credits"
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center">
                <Coins className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>{t("credits")}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </I18nLink>
          </DropdownMenuItem>

          {/* <DropdownMenuItem
            asChild
            className="h-9 cursor-pointer flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"
          >
            <I18nLink
              href="/profile/delete-account"
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center">
                <Settings className="mr-2 h-4 w-4 text-primary/70" />
                <span>{t('settings')}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </I18nLink>
          </DropdownMenuItem> */}
        </div>

        <DropdownMenuSeparator className="my-1" />

        <div className="p-1">
          <DropdownMenuItem asChild className="h-9">
            <SignOutButton>
              <button className="w-full flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 cursor-pointer transition-colors">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("signOut")}</span>
              </button>
            </SignOutButton>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
