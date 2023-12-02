import { PortalAppLinker } from "./ui/portal/portalapplinker";
import { createBouncingCircles } from "./ui/dplmovie/canvasTest";
import { DPLMovieJsonInputView } from "./ui/dplmovie/dplmoviejsoninputview";
import { DPLMovieRuntimeView } from "./ui/dplmovie/dplmovieruntimeview";
import { DPLMovieRuntimePool } from "./model/dplmovie/data/dplmovieruntimepool";
import { GraphPool } from "./model/graphplayer/data/graphpool";
import { GraphCreationView } from "./ui/graphplayer/graphcreationview";

const linker = new PortalAppLinker();

// DPL movie
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

//Graph player
const graphPool = new GraphPool();
const graphCreationView = new GraphCreationView(graphPool);

// canvas test
createBouncingCircles(0, 1, 5);
