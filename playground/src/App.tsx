import { useEffect } from "react";
import { vox } from "../../src";

export function App() {
  useEffect(() => {
    vox();
  }, []);

  return <div>App</div>;
}
