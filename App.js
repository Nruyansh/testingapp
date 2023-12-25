import React from "react";
import TabNavigator from "./navigation/TabNavigator";
import { Provider } from 'react-redux';
import store from "./redux/store";
const App = () => {
  return (
    <Provider store={store}>
      <TabNavigator />
    </Provider>
  );
};

export default App;