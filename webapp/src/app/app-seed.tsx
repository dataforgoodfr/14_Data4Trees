import { AppWrapper } from "./app-wrapper";
import { AppRouterSeed } from "./routes/app-router-seed";

import "./styles/globals.css";
import "./styles/seed.css";

const AppSeed = () => {
  return (
    <AppWrapper>
      <AppRouterSeed />
    </AppWrapper>
  );
};

export default AppSeed;
