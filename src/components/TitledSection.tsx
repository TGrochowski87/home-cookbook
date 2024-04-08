import { PropsWithChildren } from "react";

interface TitledSectionProps extends PropsWithChildren {
  readonly title: string;
  readonly noDivider?: boolean;
}

const TitledSection = ({ children, title, noDivider = false }: TitledSectionProps) => {
  return (
    <section className="titled-section">
      <h2>{title}</h2>
      {noDivider === false && <div className="divider" />}
      {children}
    </section>
  );
};

export default TitledSection;
