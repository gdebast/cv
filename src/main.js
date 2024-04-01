import { DPLMovieJsonInputView } from "./ui/dplmovie/jsoninput/dplmoviejsoninputview";
import { DPLMovieRuntimeView } from "./ui/dplmovie/runtimeview/dplmovieruntimeview";
import { DPLMovieRuntimePool } from "./model/dplmovie/data/dplmovieruntimepool";
import { DirectedGraphWrapperPool } from "./model/graphplayer/data/directedgraphwrapperpool";
import { GraphCreationView } from "./ui/graphplayer/graphcreationview";
import { GraphSelectionView } from "./ui/graphplayer/graphselectionview";
import { DirectedGraphVisualizer } from "./model/utility/directedgraph/directedgraphvisualizer";
import { DirectedGraph } from "./model/utility/directedgraph/directedgraph";
import { DPLMovieRuntimePlayerView } from "./ui/dplmovie/player/dplmovieruntimeplayerview";
import { DPLMovieCanvasView } from "./ui/dplmovie/canvas/dplmoviecanvasview";
import { PortalView } from "./ui/portal/portalview";
import { CVView } from "./ui/cv/cvview";
import { ViewTranslator } from "./ui/translator/viewtranslator";

const translator = new ViewTranslator();
const portal = new PortalView(translator);

// DPL movie
const dplMovieRuntimePool = new DPLMovieRuntimePool();
const dplMovieJsonInputView = new DPLMovieJsonInputView(dplMovieRuntimePool);
const dplMovieRuntimeView = new DPLMovieRuntimeView(dplMovieRuntimePool);
const dplMovieRuntimePlayerView = new DPLMovieRuntimePlayerView(dplMovieRuntimeView);
const dplMovieCavansView = new DPLMovieCanvasView(dplMovieRuntimeView, dplMovieRuntimePlayerView);

//Graph player
const graphPool = new DirectedGraphWrapperPool();
const graphCreationView = new GraphCreationView(graphPool);
const graphSelectionView = new GraphSelectionView(graphPool);

// CV
const cvView = new CVView(portal, translator);

/*
const vis = new DirectedGraphVisualizer(true);
const g1 = new DirectedGraph();
const g1n1 = g1.createNode("n1");
const g1n2 = g1.createNode("n2");
const g1n3 = g1.createNode("n3");
const g1n4 = g1.createNode("n4");
const g1n5 = g1.createNode("n5");
const g1n6 = g1.createNode("n6");
const g1n7 = g1.createNode("n7");
const g1n8 = g1.createNode("n8");
g1.createArc(g1n5, g1n4, "a11");
g1.createArc(g1n4, g1n1, "a8");
g1.createArc(g1n5, g1n1, "a9");
g1.createArc(g1n1, g1n3, "a1");
g1.createArc(g1n1, g1n8, "a2");
g1.createArc(g1n1, g1n2, "a3");
g1.createArc(g1n8, g1n6, "a4");
g1.createArc(g1n2, g1n7, "a5");
g1.createArc(g1n6, g1n7, "a7");
vis.positionGraphNode(g1);*/
