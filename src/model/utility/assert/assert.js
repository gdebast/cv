const ACTIVATE_ASSERT = false;

export const ASSERT_TYPE = function (obj, cls) {
  if (!ACTIVATE_ASSERT) return;
  ASSERT_EXIST(obj);
  ASSERT(obj instanceof cls, `the value is not an instance of ${cls.name}`);
};

export const ASSERT_EXIST = function (obj) {
  if (!ACTIVATE_ASSERT) return;
  ASSERT(obj, "the value is null or undefined.");
};

export const ASSERT = function (condition, message) {
  if (!ACTIVATE_ASSERT) return;
  console.assert(condition, message);
};
