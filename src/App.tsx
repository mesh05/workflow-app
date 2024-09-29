import Flow from "./components/Flow";
import NodeMenu from "./components/NodeMenu";

function App() {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <NodeMenu />
      <Flow />
    </div>
  );
}

export default App;
