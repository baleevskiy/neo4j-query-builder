import { Pattern } from "../index";

it("should return list of patters", () => {
  expect(
    Pattern.for({
      Court__HAS_GAME__Game__PLAYS_AT__Venue: { 
        HAS_GAME: { pointsTo: 'Game', params: {foo:'bar'}},  
        PLAYS_AT: { params: { date__in: [1,2,43] }},
        Court: { date__gt: "2020-01-01" },
      },
    })
  ).toEqual([
    {
      from: 'Court',
      to: 'Game',
      through: 'HAS_GAME'
    },
    params: {
      HAS_GAME: { foo:'bar' },
      Court: { date__gt: '2020-01-01'}
    }
  ]);
});
