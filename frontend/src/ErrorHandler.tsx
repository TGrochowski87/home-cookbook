import { CircleHelp, CircleX } from "lucide-react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorHandler = () => {
  const error = useRouteError() as object;
  let message = "";
  let icon = <CircleX />;

  if (isRouteErrorResponse(error) && error.status === 404) {
    icon = <CircleHelp />;
    message = "Nie znaleziono strony.";
  } else if ((error as { code: string }).code === "ERR_NETWORK") {
    message =
      "Nie udało się nawiązać połączenia z serwerem. Powiadomienie o zdarzeniu najprawdopodobniej nie zostało wysłane.";
  } else if ((error as { code: string }).code === "ERR_BAD_RESPONSE") {
    message = "Serwer zwrócił nieoczekiwany błąd. Powiadomienie powinno zostać wysłane.";
  } else {
    message = "Coś poszło bardzo nie tak. Powiadomienie o zdarzeniu najprawdopodobniej nie zostało wysłane.";
  }

  return (
    <div className="error-page">
      <div className="error-info">
        {icon}
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorHandler;
