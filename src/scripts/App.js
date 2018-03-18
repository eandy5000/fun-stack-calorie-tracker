export default function App(model, update, view, node) {
  let currentModel = model;
  let currentView = view(dispatch, currentModel);
  node.appendChild(currentView);
  function dispatch(msg) {
    currentModel = update(msg, currentModel);
    const updatedView = view(dispatch, currentModel);
    node.replaceChild(updatedView, currentView);
    currentView = updatedView;
  }
}
