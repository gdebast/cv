"use strict";

import { TranslatableString, ENG, FR } from "./translatablestring";

test("1.1 A translatable string should be translatable", () => {
  const hello = new TranslatableString({ ENG: "hello", FR: "bonjour" });
  expect(hello.getTranslation(ENG)).toEqual("hello");
  expect(hello.getTranslation(FR)).toEqual("bonjour");
});
