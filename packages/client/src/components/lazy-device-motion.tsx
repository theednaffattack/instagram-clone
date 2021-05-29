import * as React from "react";

interface DeviceMotionProps {
  bg: string;
  children?: React.ReactChildren[] | React.ReactChild;
}

const Placeholder = () => null;

function LazyDeviceMotion(props: any): React.ReactElement {
  // While the component is loading, we'll render a fallback placeholder.
  // (The Placeholder is a component that renders nothing).
  const [Component, setComponent] = React.useState(() => Placeholder);

  // After the initial render, kick off a dynamic import to fetch
  // the real component, and set it into our state.
  React.useEffect(() => {
    import("./device-motion-too").then((DeviceMotionOriginal) =>
      setComponent(() => DeviceMotionOriginal.default)
    );
  }, []);

  return <Component {...props} />;
}

export default LazyDeviceMotion;
