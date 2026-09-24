import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/features/admin/components/ui/breadcrumb";
import { getBreadcrumbs } from "@/features/admin/config/navigation";

export function AdminBreadcrumbs() {
  const { pathname } = useLocation();
  const crumbs = getBreadcrumbs(pathname);

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        {crumbs.map((crumb, idx) => {
          const isLast = idx === crumbs.length - 1;
          return (
            <Fragment key={`${crumb.title}-${idx}`}>
              {/* na wąskich ekranach zostaje tylko bieżąca strona */}
              <BreadcrumbItem className={isLast ? "min-w-0" : "max-sm:hidden"}>
                {isLast || !crumb.to ? (
                  <BreadcrumbPage className="truncate font-semibold">
                    {crumb.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.to}>{crumb.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="max-sm:hidden" />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
