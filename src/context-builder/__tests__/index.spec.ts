import _ from "lodash";
import { ContextBuilder } from "../index";

describe("ContextBuilder", () => {
  it("should compose QueryContext", async () => {
    const neo = new ContextBuilder<string>(_.identity);

    const typeQuery = neo.find({ OneType: { foo: "bar" } });
    const queryOne = await typeQuery.where({ OtherPart: "otherCondition" });
    const queryTwo = await typeQuery
      .where({ OtherPartTwo: { foo2: "bar3" } })
      .where({ OtherPartThree: { foo3: "bar4" } })
      .merge({
        Data: "data",
      })
      .set({
        a: { date__merge: { a: "b" } },
      });

    expect(queryOne).toEqual({
      find: [{ OneType: { foo: "bar" } }],
      where: [{ OtherPart: "otherCondition" }],
    });
    expect(queryTwo).toEqual({
      find: [{ OneType: { foo: "bar" } }],
      merge: [{ Data: "data" }],
      where: [
        { OtherPartTwo: { foo2: "bar3" } },
        { OtherPartThree: { foo3: "bar4" } },
      ],
    });
  });

  it("should set aliases", async () => {
    const neo = new ContextBuilder<string>(_.identity);
    const queryOne = await neo
      .find({ Rounds: { date__gt: "testDate" } })
      .with(neo.find({ Game: { date__gt: "2020-01-01" } }), "games");

    expect(queryOne).toEqual({
      find: [{ Rounds: { date__gt: "testDate" } }],
      with: { games: { find: [{ Game: { date__gt: "2020-01-01" } }] } },
    });
  });

  it("should throw when use find and findAll in the same context");
});
