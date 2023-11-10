const DPLMOVIEJSONINPUTELTID = "dpl-movie-fileItem";
const dplMovieJsonInputElt = document.getElementById(DPLMOVIEJSONINPUTELTID);

export class DPLMovieJsonInputView {
  /** contruct the view for uploading json files containing DPLMovie runtime.
   * @param {Object} runtimePool pool of the DPLMovie runtimes
   */
  constructor(runtimePool) {
    this.__initialize();
  }
  __initialize() {
    dplMovieJsonInputElt.addEventListener("change", function () {
      const file = dplMovieJsonInputElt.files[0];
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          console.log(reader.result); //todo...
        },
        false
      );
      if (file) reader.readAsText(file);
    });
  }
}
