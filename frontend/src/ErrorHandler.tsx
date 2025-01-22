import { isAxiosError } from "axios";
import { isCookbookError } from "utilities/CookbookError";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorHandler = () => {
  const error = useRouteError();
  let message = "";
  let emoji = "";

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      emoji = String.raw`¯\_(ツ)_/¯`;
      message = "Page not found.";
    } else {
      emoji = String.raw`(ಥ﹏ಥ)`;
      message = "Something went really wrong.";
    }
  } else if (isAxiosError(error)) {
    if (error.response === undefined) {
      emoji = String.raw`(╯°□°）╯︵ ┻━┻`;
      message = "Could not connect to the server.";
    } else if (error.response?.status === 500) {
      emoji = String.raw`(╯°□°）╯︵ ┻━┻`;
      message = "Server returned an unexpected error.";
    } else if (error.response?.status === 404) {
      emoji = String.raw`¯\_(ツ)_/¯`;
      message = "Server could not find the requested resource.";
    } else {
      emoji = String.raw`(ಥ﹏ಥ)`;
      message = "Something went really wrong.";
    }
  } else if (isCookbookError(error)) {
    if (error.status === 404) {
      emoji = String.raw`¯\_(ツ)_/¯`;
      message = "Server could not find the requested resource.";
    } else {
      emoji = String.raw`(ಥ﹏ಥ)`;
      message = "Something went really wrong.";
    }
  } else {
    emoji = String.raw`(ಥ﹏ಥ)`;
    message = "Something went really wrong.";
  }

  return (
    <div className="error-page">
      <div className="error-info">
        <p>{emoji}</p>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorHandler;
