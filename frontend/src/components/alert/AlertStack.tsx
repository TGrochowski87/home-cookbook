import { PropsWithChildren, createContext, useContext, useState } from "react";
import Alert, { AlertType } from "./Alert";
import "../styles.less";

interface AlertData {
  readonly type: AlertType;
  readonly message: string;
  readonly fadeOutAfter: number;
}

export interface AlertStackContextData {
  displayMessage: (props: AlertData) => void;
}

const AlertStackContext = createContext<AlertStackContextData | null>(null);

//TODO: use navigator.virtualKeyboard once on HTTPS to fix fixed position on chrome mobile
export const AlertStackContextProvider = ({ children }: PropsWithChildren) => {
  const [alertStack, setAlertStack] = useState<Record<number, AlertData>>({});
  const [nextKey, setNextKey] = useState<number>(0);

  const displayMessage = (data: AlertData) => {
    const currentKey = nextKey;
    setNextKey(prev => ++prev);
    setAlertStack(prev => ({ ...prev, [currentKey]: data }));

    setTimeout(() => {
      setAlertStack(prev => {
        // This entry must be assigned to a variable to be discarded.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [currentKey]: _, ...remainingStack } = prev;
        return remainingStack;
      });
    }, data.fadeOutAfter);
  };

  return (
    <AlertStackContext.Provider value={{ displayMessage }}>
      <div className="alert-stack-container">
        {Object.keys(alertStack).map(key => (
          <Alert key={key} type={alertStack[+key].type} message={alertStack[+key].message} />
        ))}
      </div>
      {children}
    </AlertStackContext.Provider>
  );
};

export const useAlerts = (): AlertStackContextData => {
  const context = useContext(AlertStackContext);
  if (!context) {
    throw new Error("useAlerts hook must be used within an AlertStackContextProvider.");
  }

  return context;
};
