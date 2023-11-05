const DPLMOVIEJSONINPUTELTID = "dpl-movie-fileItem";
const dplMovieJsonInputElt = document.getElementById(DPLMOVIEJSONINPUTELTID);

export class DPLMovieJsonInputView {
  constructor() {
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
