import { FindClause } from "../index";

describe("FindClause", () => {
  it("should construct from string", () => {
    const clauses = FindClause.of({
      SomeField: { foo: "bar" },
      SomeField2: { anotherData: "someVlaue" },
    });

    expect(clauses).toEqual([
      { filter: { foo: "bar" }, name: "SomeField" },
      { filter: { anotherData: "someVlaue" }, name: "SomeField2" },
    ]);
  });
});
