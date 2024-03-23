import * as Switch from "@radix-ui/react-switch";

const PageSwitch = () => {
  return (
    <Switch.Root className="page-switch">
      <div className="labels">
        <p>Przepisy</p>
        <p>Zakupy</p>
      </div>
      <Switch.Thumb className="switch-thumb" />
    </Switch.Root>
  );
};

export default PageSwitch;
