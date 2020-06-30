import _ from "lodash";
import { Condition } from "../index";

it("should return proper conditions", () => {
  const Q = _.identity;
  expect(
    Condition.for({
      Game__dateCreated__gte: "2020-01-01",
      some_other_field__ne: 12345,
      third_field: "testValue",
      customField: Q('date("2020-01-03")'),
    }).map(({ left, comparator }) => [
      left,
      comparator.comparator,
      comparator.value,
    ])
  ).toEqual([
    ["Game.dateCreated", ">=", "2020-01-01"],
    ["some_other_field", "<>", 12345],
    ["third_field", "=", "testValue"],
    ["customField", "=", 'date("2020-01-03")'],
  ]);
});
