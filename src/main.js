import { PortalAppLinker } from "./ui/portal/portalapplinker";
import { createBouncingCircles } from "./ui/dplmovie/canvasTest";
import { DPLMovieJsonInputView } from "./ui/dplmovie/dplmoviejsoninputview";
import { DPLMovieRuntimeView } from "./ui/dplmovie/dplmovieruntimeview";
import { DPLMovieRuntimePool } from "./model/dplmovie/dplmovieruntimepool";
import { DirectedGraph } from "./model/utility/directedgraph/directedgraph";

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
createBouncingCircles(15, 1, 5);

const g3 = new DirectedGraph();
const g3n1 = g3.createNode("n1");
const g3n2 = g3.createNode("n2");
const g3n3 = g3.createNode("n3");
const g3n4 = g3.createNode("n4");
g3.createNode("n5");
g3.createArc(g3n1, g3n2, "a1");
g3.createArc(g3n1, g3n3, "a2");
g3.createArc(g3n2, g3n4, "a3");
g3.createArc(g3n3, g3n4, "a4");
g3.computeLevelsClustersAndCycles(true);
