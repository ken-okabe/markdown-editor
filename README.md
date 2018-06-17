# Markdown Editor

test

Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the 
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3


 

```js
(() => {
  "use strict";

  const M = require("./index");

  const toList = arr => arr.reduce((a, b) => (a)(b), (M));

  const mlog = m => o => {
    console.log(m + "\n" + o.val);
    return o;
  };

  const util = require("util");
  const validate = a => b => util.inspect(a) === util.inspect(b)
    ? true : false;

  const f = x => (M)(x + 7);
  const g = x => (M)(x * 5);
  const a = 9;
  const m = (M)(3)(5)(7);

  console.log(
    validate(
      (M)(a).bind(f)
    )(
      f(a)
    )
  );
  console.log(
    validate(
      m.bind(M)
    )(
      m
    )
  );
  console.log(
    validate(
      m.bind(f)
        .bind(g)
    )(
      m.bind(x => f(x)
        .bind(g))
    )
  );

  mlog("----------")(
    (M)(1)(2)(M)(3)
  );


  const x = (M)(1);
  const y = (M)(2);
  const z = (M)(10);

  console.log((M)(M)(M));

  const xyz = (x)(y)(z);
  mlog("xyz----------")(
    xyz
  );

  mlog("--fold----")(
    (M)(1)(2)(9)
      .fold((a, b) => (a + b))
  );
  mlog("--fold2----")(
    (M)(2)(1)
      .fold((a, b) => (10 * a + b))
  );
  mlog("--fold3----")(
    (M)(2)(1)
      .fold((a, b) => (M)(b))
  );

  console.log("IO monoid=================");
  (M)(1)(2)(9)
    .fold((a, b) => {
      const result = a + b;
      console.log("IO: " + result);
      return (result);
    });

  mlog("monoid map============")(
    (M)(10)(20)(30)
      .fold((a, b) => (M)(a)(b))
  );

  mlog("monoid map============")(
    (M)(10)(20)(30)
      .fold((a, b) => (M)(a)(b * 2))
  );

  mlog("monoid map fail============")(
    (M)(10)(20)(30)
      .fold((a, b) => (M)(a * 2)(b))
  );

  mlog("max ============")(
    (M)(10)(20)(30)
      .fold((a, b) => (a > b) ? a : b)
  );

  mlog("min ============")(
    (M)(10)(20)(30)
      .fold((a, b) => (a < b) ? a : b)
  );

  mlog("first ============")(
    (M)(10)(20)(30)
      .fold((a, b) => (M)(a))
  );
  mlog("last ============")(
    (M)(10)(20)(30)
      .fold((a, b) => (M)(b))
  );

  mlog("monoid map fail============")(
    (M)(10)(20)(30)
      .fold((A, B) => ((M)(A * 2)
        .fold((a, b) => (M)(b))))
  );

  console.log("state monoid=================");
  (M)("state0")("update1")("update2")
    .fold((oldState, update) => {
      console.log("sate:" + oldState);
      console.log("update:" + update);
      return (update);
    });

  console.log("+++++++++++++++++++");

  mlog("fold to map")(
    (M)(10)(20)(30)(40)
      .bind(a => a * 2)
  );

  mlog("--fold- MM---")(
    (M)(10)(20)(30)(40)
      .fold((a, b) => (M)(a)(b)(a)(b))
  );

  const add1 = (a) => (M)(a + 1);

  mlog("---bind---")(
    (M)(9).bind(add1)
  );

  mlog("------")(
    (M)(999)(9).bind(add1)
  );
  mlog("--bind----")(
    (M)(9)(8)
      .bind((a) => (a))
  );
  const add5 = (a => a + 5);
  mlog("--bind5----")(
    (M)(100)(101)
      .bind(add5)
  );
  const add10 = a => a + 5;
  mlog("--bind10----")(
    (M)(100)(101)
      .bind(add5)
      .bind(add5)
  );
  mlog("------")(
    (M)(add1)(add1).bind(f => f(3)) //
  );
  mlog("------")(
    (M)(add1).bind(f => f(3)) //4
  );

  mlog("------")(
    (M)(9).bind(x => x)
  );

  console.log("------");

  const double = (a) => (M)(a)(a);

  mlog("xyz--bind------")(
    xyz
      .bind(double)
      .bind(double)
      .bind(add1)
  );


  const add20 = x => x + 20;
  const compose = (f, g) => (x => g(f(x)));
  //console.log(m);
  mlog("--fold--compose 0--")(
    (M)(100).bind(add20)
  );

  mlog("--fold--compose--")(
    (M)(100)(200).bind(
      M(add20)(add20)(add20).fold(compose)
    )
  );

  const plus = (x) => (y => x + y);
  const plus1 = (M)(1)
    .bind(plus);

  mlog("--123 p1 p1----")(
    (M)(1)(2)(3)
      .bind(plus1)
  );
  mlog("--fold----")(
    (M)(1)(2)(3)
      .bind(plus1)
      .fold((a, b) => (a + b))
  );


})();
```
