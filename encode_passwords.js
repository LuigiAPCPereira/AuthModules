const passwords = [
  "Ab1!", // too short
  "abc1def!", // no uppercase
  "ABC1DEF!", // no lowercase
  "Abc!Defg", // no number
  "Abc1Defg", // no special
  "Abc1!Def", // valid 1
  "Xyz2@Wvu"  // valid 2
];

passwords.forEach(p => {
  const codes = [];
  for (let i = 0; i < p.length; i++) {
    codes.push(p.charCodeAt(i));
  }
  console.log(`// "${p}"\nString.fromCharCode(${codes.join(", ")})`);
});
