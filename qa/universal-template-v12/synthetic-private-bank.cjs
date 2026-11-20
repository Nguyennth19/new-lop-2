'use strict';
/**
 * SYNTHETIC TEST BANK ONLY. PUBLIC GitHub source; therefore NOT a secret answer
 * store and NEVER for real student assessment. Runtime Node only (not HTML).
 * Exact keys are scoped to the two synthetic LAB packs A/B with frozen version.
 * Real lessons require private server storage, authentication and approval.
 */
const keys=Object.freeze({
 MATH_LAB_A:Object.freeze({
  D2:53,D3:Object.freeze({l1:'r1',l2:'r2'}),D4:'opt2',
  D6:Object.freeze({n1:'slot_1',n2:'slot_3',n3:'slot_2'}),
  D7:Object.freeze({row1:'<',row2:'='}),D8:7,
  D9:Object.freeze({qa:'6',qb:'2'})
 }),
 MATH_LAB_B:Object.freeze({
  D2:72,D3:Object.freeze({l1:'r2',l2:'r1'}),D4:'opt2',
  D6:Object.freeze({n1:'slot_3',n2:'slot_1',n3:'slot_2'}),
  D7:Object.freeze({row1:'>',row2:'='}),D8:9,
  D9:Object.freeze({qa:'4',qb:'3'})
 })
});
module.exports=keys;
