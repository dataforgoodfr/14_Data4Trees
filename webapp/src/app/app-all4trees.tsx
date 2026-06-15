import { AppWrapper } from "./app-wrapper";
import { AppRouterAll4Trees } from "./routes/app-router-all4trees";

import "./styles/globals.css";
import "./styles/all4trees.css";

const AppAll4Trees = () => {
  return (
    <AppWrapper>
      <AppRouterAll4Trees />
    </AppWrapper>
  );
};

export default AppAll4Trees;
