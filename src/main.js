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

const g = new DirectedGraph();

const n1 = g.createNode("n1");
const n2 = g.createNode("n2");
const n3 = g.createNode("n3");
const n4 = g.createNode("n4");
const n5 = g.createNode("n5");
const n6 = g.createNode("n6");
const n7 = g.createNode("n7");
const n8 = g.createNode("n8");
//g.createArc(n4, n5, "a10");
g.createArc(n5, n4, "a11");
g.createArc(n4, n1, "a8");
g.createArc(n5, n1, "a9");
g.createArc(n1, n3, "a1");
g.createArc(n1, n8, "a2");
g.createArc(n1, n2, "a3");
g.createArc(n8, n6, "a4");
g.createArc(n2, n7, "a5");
g.createArc(n6, n7, "a7");
//g.createArc(n7, n6, "a6");
g.computeLevelsClustersAndCycles();
