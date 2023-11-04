import { PortalAppLinker } from "./ui/portal/portalapplinker";
import { canvasTest } from "./ui/dplmovie/canvasTest";

const linker = new PortalAppLinker();
linker.linkAll();

// file input test
const fileInput = document.getElementById("dpl-movie-fileItem");

fileInput.addEventListener("change", function () {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.addEventListener(
    "load",
    function () {
      console.log(reader.result);
    },
    false
  );
  if (file) reader.readAsText(file);
});

// canvas test
canvasTest();
