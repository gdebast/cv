import { PortalAppLinker } from "./ui/portal/portalapplinker";
import { canvasTest } from "./ui/dplmovie/canvasTest";
import { DPLMovieJsonInputView } from "./ui/dplmovie/dplmoviejsoninputview";
import { DPLMovieRuntimeView } from "./ui/dplmovie/dplmovieruntimeview";
import { DPLMovieRuntimePool } from "./model/dplmovie/dplmovieruntimepool";

const linker = new PortalAppLinker();
const dplMovieRuntimePool = new DPLMovieRuntimePool();
const dplMovieJsonInputView = new DPLMovieJsonInputView(dplMovieRuntimePool);
const dplMovieRuntimeView = new DPLMovieRuntimeView(dplMovieRuntimePool);
dplMovieRuntimePool.addRuntime(
  "Deployment Solver",
  "FIFO",
  new Date(1988, 0, 10)
);
dplMovieRuntimePool.addRuntime(
  "Deployment Solver",
  "lotsize",
  new Date(1991, 11, 23)
);

// canvas test
canvasTest();
