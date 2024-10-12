import { Link, useRouteError } from "react-router-dom";

interface Error {
  statusText?: string;
  message?: string;
  status?: number;
}

export default function ErrorPage() {
  const error = useRouteError() as Error; // Type assertion

  return (
    <div
      id="error-page"
      className="flex items-center flex-col gap-2 h-[calc(100vh-100px)] justify-center"
    >
      <h1 className="text-4xl">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {error.statusText === "Not Found" && (
          <p className="text-mainColor m-2 text-xl text-center">404</p>
        )}
        <i>
          {error.statusText || error.message || "An unknown error occurred"}
        </i>
      </p>
      <Link
        className="bg-blue-500 p-2 px-4 rounded-md hover:bg-blue-600"
        to="/"
      >
        Home
      </Link>
      {window.location.href}
    </div>
  );
}
