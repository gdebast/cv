import { PortalAppLinker } from "./ui/portal/portalapplinker";
import { createBouncingCircles } from "./ui/dplmovie/canvasTest";
import { DPLMovieJsonInputView } from "./ui/dplmovie/dplmoviejsoninputview";
import { DPLMovieRuntimeView } from "./ui/dplmovie/dplmovieruntimeview";
import { DPLMovieRuntimePool } from "./model/dplmovie/data/dplmovieruntimepool";
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

const g5 = new DirectedGraph();
const g5n1 = g5.createNode("n1");
const g5n2 = g5.createNode("n2");
const g5n3 = g5.createNode("n3");
const g5n4 = g5.createNode("n4");
g5.createArc(g5n1, g5n2, "a1");
g5.createArc(g5n2, g5n1, "a2");
g5.createArc(g5n2, g5n3, "a3");
g5.createArc(g5n2, g5n4, "a4");
g5.createArc(g5n3, g5n4, "a5");
g5.createArc(g5n4, g5n3, "a6");

g5.computeLevelsClustersAndCycles(true);

console.log(g5);
