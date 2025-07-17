import { useRouteError, isRouteErrorResponse } from "react-router-dom";

const Error = () => {
  const error = useRouteError();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ color: "red" }}>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>

      {isRouteErrorResponse(error) ? (
        <p style={{ color: "#555" }}>
          <i>{error.status} — {error.statusText}</i>
        </p>
      ) : (
        <p style={{ color: "#555" }}>
          <i>{(error as Error)?.message || "Unknown error"}</i>
        </p>
      )}
    </div>
  );
};

export default Error;
