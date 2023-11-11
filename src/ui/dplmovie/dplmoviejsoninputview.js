const DPLMOVIEJSONINPUTELTID = "dpl-movie-fileItem";
const CLASS_DPLMOVIEUPLOADBTN = "dplmovie-upload-btn";
const CLASS_APPBTNERROR = "app-btn-error";
const CLASS_APPBTNERRORMESSAGEBOX = "app-btn-error-message-box";
const dplMovieJsonInputElt = document.getElementById(DPLMOVIEJSONINPUTELTID);
const dplMovieJsonInputBtnElt = document.querySelector(
  `.${CLASS_DPLMOVIEUPLOADBTN}`
);
const HTML_CLOSE =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"> <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368L144 144M368 144L144 368"/> </svg>';

export class DPLMovieJsonInputView {
  /** contruct the view for uploading json files containing DPLMovie runtime.
   * @param {Object} runtimePool pool of the DPLMovie runtimes
   */
  constructor(runtimePool) {
    this._dplMovieRuntimePool = runtimePool;
    this._initialize();
  }
  _initialize() {
    const self = this;
    dplMovieJsonInputElt.addEventListener("change", function () {
      self._toggleErrorOnUpload(undefined);
      const file = dplMovieJsonInputElt.files[0];
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        function () {
          let message = undefined;
          let jsonObject = undefined;
          try {
            jsonObject = JSON.parse(reader.result);
          } catch (error) {
            message = "This file could not be parsed as json.";
          }
          if (!message && jsonObject) {
            message = self._addRuntime(jsonObject);
          }

          self._toggleErrorOnUpload(message);
        },
        false
      );
      if (file) reader.readAsText(file);
    });
  }

  /** add a DPLMovie runtime from a jsonObject read from the file.
   *  If there are errors, this method returns a message.
   *  @param {Object} jsonObject object to be read to create a DPLMovie runtime
   *  @returns {String} error message. undefined if no error.
   */
  _addRuntime(jsonObject) {
    if (!jsonObject.solverName)
      return "Missing 'solverName' property in json file.";
    if (!jsonObject.solverType)
      return "Missing 'solverType' property in json file.";
    if (!jsonObject.runtimeStartDate)
      return "Missing 'runtimeStartDate' property in json file.";
    const runtimeStartDate = new Date(jsonObject.runtimeStartDate);
    if (!this._isValidDate(runtimeStartDate))
      return `Cannot convert '${jsonObject.runtimeStartDate}' property in json file in date.`;

    this._dplMovieRuntimePool.addRuntime(
      jsonObject.solverType,
      jsonObject.solverName,
      runtimeStartDate
    );
    return undefined;
  }
  /** display a message and turn the upload button red to indicate to the user that the upload failed.
   * @param {String} message error message to display. If undefined, remove the message and turn the button back to normal.
   */
  _toggleErrorOnUpload(message) {
    if (!message) {
      dplMovieJsonInputBtnElt.classList.remove(CLASS_APPBTNERROR);
      const messageBoxElt = document.querySelector(
        `.${CLASS_APPBTNERRORMESSAGEBOX}`
      );
      if (messageBoxElt) dplMovieJsonInputBtnElt.removeChild(messageBoxElt);
      return;
    }

    // turn the button
    dplMovieJsonInputBtnElt.classList.add(CLASS_APPBTNERROR);

    // add a message box
    const messageBoxElt = document.createElement("div");
    const messageElt = document.createElement("p");
    const closeButtonElt = document.createElement("button");
    closeButtonElt.innerHTML = HTML_CLOSE;
    messageElt.textContent = message;
    messageBoxElt.classList.add(CLASS_APPBTNERRORMESSAGEBOX);
    dplMovieJsonInputBtnElt.append(messageBoxElt);
    messageBoxElt.append(messageElt);
    messageBoxElt.append(closeButtonElt);
    const self = this;
    closeButtonElt.addEventListener("click", function () {
      self._toggleErrorOnUpload(undefined);
    });
  }

  _isValidDate(date) {
    return date instanceof Date && !isNaN(date);
  }
}
