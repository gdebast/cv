const ACTIVATE_ASSERT =
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV ===
    "test"; /*if true, inline all asserts, otherwise remove all asserts */
export const ASSERT_TYPE = function (obj, cls) {
  if (!ACTIVATE_ASSERT) return;
  ASSERT_EXIST(obj);
  ASSERT(
    obj instanceof cls,
    `the value is not an instance of '${
      cls.name
    }' but of '${typeof obj}' (value: ${obj})`
  );
};

export const ASSERT_EXIST = function (obj) {
  if (!ACTIVATE_ASSERT) return;
  ASSERT(obj, "the value is null or undefined.");
};

export const ASSERT = function (condition, message) {
  if (!ACTIVATE_ASSERT) return;
  if (!condition) throw new Error(message);
};
