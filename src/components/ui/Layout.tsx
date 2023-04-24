import Link from "next/link";
import { ReactNode } from "react";

// components/layout.js
type LayoutProps = { children?: ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="main-dashboard">
        {/* MAIN CONTAINER */}
        <div className="border-sm flex justify-center">
          {/* SIDEBAR */}
          <div className="w-1/6 border-r border-r-slate-700 p-4 text-left">
            <div className="sticky top-0 z-50">
              <h3 className="p-2 text-lg font-bold">Menu</h3>
              <div className="p-2">
                {/* <Link href="bulk-submit">Bulk Submissions</Link> */}
              </div>
              <div className="p-2">
                <Link href="schedule">Schedule Posts</Link>
              </div>
              <div className="p-2">
                <Link href="manage-posts">Manage Posts</Link>
              </div>
            </div>
          </div>

          {/* MAIN PANEL */}
          <div className="w-5/6 p-8">
            <div>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
