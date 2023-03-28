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
              <div className="p-2">Bulk Submissions</div>
              <div className="p-2">Schedule Posts</div>
            </div>
          </div>

          {/* MAIN PANEL */}
          <div className="w-5/6 p-8">
            <h1>Protected Page</h1>
            <p>You can view this page because you are signed in.</p>

            <div>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
