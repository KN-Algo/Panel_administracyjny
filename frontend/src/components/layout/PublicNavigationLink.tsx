import { NavLink, type NavLinkProps } from "react-router-dom";

type NavigationLinkVariant = "desktop" | "mobile";

interface PublicNavigationLinkProps extends Omit<NavLinkProps, "className"> {
  variant: NavigationLinkVariant;
  disabled?: boolean;
  navigating?: boolean;
}

const desktopClasses = "group relative inline-flex min-h-11 items-center text-brand-light transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:bg-brand-light after:transition-transform hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light focus-visible:ring-offset-4 focus-visible:ring-offset-brand-dark";
const mobileClasses = "mobile-navigation__link flex min-h-12 items-center rounded-md px-3 py-3 text-lg text-brand-light hover:bg-brand-dark-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-light";

export function PublicNavigationLink({
  variant,
  disabled = false,
  navigating = false,
  ...props
}: PublicNavigationLinkProps) {
  return (
    <NavLink
      {...props}
      end
      aria-disabled={disabled || undefined}
      className={({ isActive }) => {
        const activeClass = variant === "desktop"
          ? isActive ? "text-white after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
          : isActive ? "mobile-navigation__link--active" : "";
        const navigatingClass = navigating ? " mobile-navigation__link--navigating" : "";
        return `${variant === "desktop" ? desktopClasses : mobileClasses} ${activeClass}${navigatingClass}`;
      }}
    />
  );
}
