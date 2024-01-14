import { ASSERT_EXIST } from "../../model/utility/assert/assert";
import { DirectedGraphVisualizer } from "../../model/utility/directedgraph/directedgraphvisualizer";

/** this class is a ui component able to visualize a directed graph
 */
export class DirectedGraphVisualizerView {
  constructor(canvasHtmlElment) {
    ASSERT_EXIST(canvasHtmlElment);
    this._canvasHtmlElment = canvasHtmlElment;
    this._canvasHtmlElment.width = window.innerWidth;
    this._canvasHtmlElment.height = window.innerHeight;
    this._directedGraphVisualizer = new DirectedGraphVisualizer(
      false /*debug?*/
    );
    this._visualizedDirectedGraph = null;
  }

  set visualizedDirectedGraph(graph) {
    this._visualizedDirectedGraph = graph;
    this._installGraphOnCanvas();
  }

  /**  main method to visualize a graph. It will make sure that the graph is drawn in the canvas.
   */
  _installGraphOnCanvas() {
    if (!this._visualizedDirectedGraph) return;
    this._directedGraphVisualizer.positionGraphNode(
      this._visualizedDirectedGraph
    );
  }
}
