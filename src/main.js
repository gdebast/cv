import { RuntimeTracker } from "./runtimetracker";
import { PortalAppLinker } from "./ui/portal/portalapplinker";

const t = new RuntimeTracker();

const linker = new PortalAppLinker();
linker.linkAll();

console.log(t.add(1, 1));

const fileInput = document.getElementById("fileItem");

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
