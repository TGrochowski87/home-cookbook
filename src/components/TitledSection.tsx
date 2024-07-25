import { PropsWithChildren, ReactNode } from "react";

interface TitledSectionProps extends PropsWithChildren {
  readonly title: string | ReactNode;
  readonly noDivider?: boolean;
}

const TitledSection = ({ children, title, noDivider = false }: TitledSectionProps) => {
  return (
    <section className="titled-section">
      {typeof title === "string" ? <h2>{title}</h2> : title}
      {noDivider === false && <div className="divider" />}
      {children}
    </section>
  );
};

export default TitledSection;
