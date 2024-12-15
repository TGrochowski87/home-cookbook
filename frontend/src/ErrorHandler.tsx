import { isAxiosError } from "axios";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorHandler = () => {
  const error = useRouteError();
  let message = "";
  let emoji = "";

  if (isRouteErrorResponse(error) && error.status === 404) {
    emoji = String.raw`¯\_(ツ)_/¯`;
    message = "Nie znaleziono strony.";
  } else if (isAxiosError(error)) {
    if (error.response === undefined) {
      emoji = String.raw`(╯°□°）╯︵ ┻━┻`;
      message = "Nie udało się nawiązać połączenia z serwerem.";
    } else if (error.response?.status === 500) {
      emoji = String.raw`(╯°□°）╯︵ ┻━┻`;
      message = "Serwer zwrócił nieoczekiwany błąd. Powiadomienie powinno zostać wysłane.";
    } else if (error.response?.status === 404) {
      emoji = String.raw`¯\_(ツ)_/¯`;
      message = "Serwer nie znalazł oczekiwanego zasobu.";
    } else {
      emoji = String.raw`(ಥ﹏ಥ)`;
      message = "Coś poszło bardzo nie tak.";
    }
  } else {
    emoji = String.raw`(ಥ﹏ಥ)`;
    message = "Coś poszło bardzo nie tak.";
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
