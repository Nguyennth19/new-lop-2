/* Run: node --test test_variant_engine.cjs
   Pure offline planner tests; no network, Google credentials or source bitmap edits. */
const test=require("node:test");
const assert=require("node:assert/strict");
const {buildPlan,eligibleAssets}=require("./variant_engine.js");
const fullRegistry=require("../Asset_Registry_V5_WORKING_288.json");
const pilotProfiles=require("./pilot_asset_profiles.json");
const plan=(input,seed="learner-independent:lesson:attempt-1")=>buildPlan(input,fullRegistry,pilotProfiles,seed);
const has=(p,id)=>p.asset_ids.includes(id);
test("pilot profiles are real IDs in V5",()=>{
  const ids=new Set(fullRegistry.assets.map(a=>a.id));
  assert.equal(fullRegistry.assets.length,288);
  assert.equal(new Set(pilotProfiles.profiles.map(a=>a.asset_id)).size,pilotProfiles.profiles.length);
  pilotProfiles.profiles.forEach(p=>assert.ok(ids.has(p.asset_id),p.asset_id));
});
test("T01 a single chicken icon may illustrate a flock only decoratively",()=>{
 const p=plan({role:"DECORATIVE",object:"chicken",count:"unspecified"});
 assert.equal(p.status,"OK");assert.equal(p.mode,"DECORATIVE_SINGLE");assert.equal(p.placements.length,1);assert.equal(p.numeric_claim,false);
});
test("T02 grouping 3+3 yields exactly six separately rendered hens",()=>{
 const p=plan({role:"DATA_BEARING",object:"chicken",groups:[{pen:"A",count:3},{pen:"B",count:3}]});
 assert.equal(p.status,"OK");assert.equal(p.count,6);assert.deepEqual(p.group_totals,[3,3]);assert.deepEqual(p.placements.map(x=>x.group),["A","A","A","B","B","B"]);
 assert.equal(p.content_signoff_required,true);
});
test("T03 one book is one image",()=>assert.equal(plan({role:"DATA_BEARING",object:"book",count:1}).placements.length,1));
test("T04 stack five books uses five copies, not an arbitrary stack asset",()=>{
 const p=plan({role:"DATA_BEARING",object:"book",count:5,layout:"stack"});
 assert.equal(p.mode,"STACKED_REPEAT");assert.equal(p.placements.length,5);
});
test("T05 single gift forbids the multiple-gift bitmap",()=>{
 const p=plan({role:"DATA_BEARING",object:"gift_box",count:1});
 assert.equal(p.status,"OK");assert.ok(has(p,"KL_M06_003"));assert.ok(has(p,"KL_SH12_006"));assert.ok(!has(p,"KL_M03_012"));
});
test("T06 plural illustrative gifts use known stack but make no count claim",()=>{
 const p=plan({role:"ILLUSTRATIVE",object:"gift_box",count:"plural_unspecified"});
 assert.equal(p.mode,"ILLUSTRATIVE_STACK");assert.equal(p.selected_asset_id,"KL_M03_012");assert.equal(p.numeric_claim,false);
});
test("T07 ten unit blocks are ten individual instances",()=>assert.equal(plan({role:"DATA_BEARING",object:"unit_cube",count:10}).placements.length,10));
test("T08 ten strip exactly 10 cells",()=>{const p=plan({role:"DATA_BEARING",object:"ten_strip",represented_units:10});assert.equal(p.mode,"UI_TEN_STRIP");assert.equal(p.cells,10)});
test("T09 hundred grid 10x10",()=>{const p=plan({role:"DATA_BEARING",object:"hundred_grid",cells:100});assert.equal(p.mode,"UI_GRID");assert.equal(p.rows*p.columns,100)});
test("T10 mass uses numeric variant label, never guesses bitmap mass",()=>{const p=plan({role:"DATA_BEARING",object:"mass",value:2,unit:"kg"});assert.equal(p.label.text,"2 kg");assert.equal(p.label.source,"VARIANT_INPUT_NOT_SOURCE_BITMAP")});
test("T11 capacity uses generated schematic, not unverified source markings",()=>{const p=plan({role:"DATA_BEARING",object:"capacity",value:3,unit:"l"});assert.equal(p.label.text,"3 l");assert.equal(p.calibration,"GENERATED_SCHEMATIC_NOT_BITMAP_SCALE")});
test("T12 raindrop decoration cannot be used as a count datum",()=>{const p=plan({role:"DECORATIVE",object:"rain"});assert.equal(p.mode,"DECORATIVE_PATTERN");assert.equal(p.numeric_claim,undefined)});
test("T13 same seed is stable, and both ball versions are eligible",()=>{
 const q={role:"DECORATIVE",object:"ball"};const a=plan(q,"student-independent:Q7:A1");const b=plan(q,"student-independent:Q7:A1");assert.equal(a.selected_asset_id,b.selected_asset_id);assert.equal(a.asset_ids.length,2);
});
test("T14 red laced shoes exclude blue strapped shoes",()=>{
 const p=plan({role:"DATA_BEARING",object:"shoes",color:"red",closure:"laces",count:2});
 assert.deepEqual(p.asset_ids,["KL_SH08_012"]);assert.equal(p.represented_items,2);assert.equal(p.represented_pairs,1);
});
test("T15 a source-locked figure missing from registry fails closed",()=>{
 const p=plan({role:"SOURCE_LOCKED",asset_id:"SOURCE_FIGURE_ID"});assert.equal(p.status,"ASSET_REQUIRED_REVIEW");
});
test("valid source pin is deterministic and has no random replacement",()=>{
 const p=plan({role:"SOURCE_LOCKED",asset_id:"KL_SH05_004"});
 assert.equal(p.status,"OK");assert.equal(p.mode,"PINNED");assert.equal(p.randomized,false);assert.deepEqual(p.asset_ids,["KL_SH05_004"]);
});
test("no assets meet wrong feature constraints -> review required",()=>{
 const p=plan({role:"DATA_BEARING",object:"shoes",color:"green",closure:"laces",count:2});
 assert.equal(p.status,"ASSET_REQUIRED_REVIEW");assert.equal(p.placements.length,0);
});
test("a hundred grid requested with 99 cells must not show a hundred",()=>{
 const p=plan({role:"DATA_BEARING",object:"hundred_grid",cells:99});assert.equal(p.status,"INVALID_REQUEST");
});
test("ten strip requested as 9 units must not silently show 10",()=>{
 const p=plan({role:"DATA_BEARING",object:"ten_strip",represented_units:9});assert.equal(p.status,"INVALID_REQUEST");
});
test("invalid quantity is never rendered",()=>{
 for(const count of [0,-1,101,2.5]){
  const p=plan({role:"DATA_BEARING",object:"book",count});
  assert.equal(p.status,"INVALID_REQUEST");
 }
});
test("unknown object fails without a silent semantic substitution",()=>{
 const p=plan({role:"DATA_BEARING",object:"unavailable_object",count:5});
 assert.equal(p.status,"ASSET_REQUIRED_REVIEW");
});
test("a stack may not be substituted to count a specific number of gift boxes",()=>{
 const p=plan({role:"DATA_BEARING",object:"gift_box",count:5});
 assert.equal(p.status,"OK");assert.equal(p.placements.length,5);assert.ok(!has(p,"KL_M03_012"));
});
test("group totals exceeding cap fail closed",()=>{
 const p=plan({role:"DATA_BEARING",object:"chicken",groups:[{count:100},{count:5}]});
 assert.equal(p.status,"INVALID_REQUEST");
});
test("color constrained unit cube chooses the matching color only",()=>{
 const p=plan({role:"DATA_BEARING",object:"unit_cube",color:"blue",count:2});
 assert.deepEqual(p.asset_ids,["KL_M01_008"]);
});
test("selection eligibility never returns IDs not in registry",()=>{
 const eligible=eligibleAssets({role:"DECORATIVE",object:"ball"},fullRegistry,pilotProfiles);
 const ids=new Set(fullRegistry.assets.map(a=>a.id));
 assert.ok(eligible.every(p=>ids.has(p.asset_id)));
});
