/* QA-only browser injection. The archived HTML remains byte-for-byte unchanged. */
(function(){
  const root=document.documentElement;
  const record=(key,value)=>root.setAttribute('data-v11-'+key,String(value));
  const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  const fail=e=>{record('error',e.stack||e.message||e);record('success',false)};
  window.addEventListener('load',async()=>{
    try{
      // The original onload renders Type 1. Switch to original Type 2.
      isMuted=true;
      loadExerciseType(1);
      await sleep(120);
      const ids=['t2_q1_u','t2_q1_t','t2_q2_u','t2_q2_t','t2_q2_h'];
      const missing=ids.filter(x=>!document.getElementById('slot_'+x));
      record('fields',ids.length-missing.length);
      record('original-2-column',document.getElementById('slot_t2_q1_t')!==null);
      record('original-3-column',document.getElementById('slot_t2_q2_h')!==null);
      record('row-markers',document.getElementById('interactiveStage').textContent.includes('356') ? 'three-digit-in-one-node' : 'separate-digit-dom');
      if(missing.length)throw Error('Missing '+missing.join(','));
      selectInputSlot('t2_q2_u',1);
      handleNumpadPress('4');await sleep(180);
      record('auto-ones-to-tens',activeInputId==='t2_q2_t');
      handleNumpadPress('8');await sleep(180);
      record('auto-tens-to-hundreds',activeInputId==='t2_q2_h');
      handleNumpadPress('4');await sleep(180);
      record('value-484',inputValues.t2_q2_u==='4'&&inputValues.t2_q2_t==='8'&&inputValues.t2_q2_h==='4');
      record('last-focus',activeInputId==='t2_q2_h');
      // Check carry toggle for 356+128; it should preserve entries.
      toggleCarry('c2_tens');await sleep(110);
      record('toggle-carry-1',t2Carries.c2_tens===true);
      record('carry-preserves-answer',inputValues.t2_q2_u==='4'&&inputValues.t2_q2_t==='8'&&inputValues.t2_q2_h==='4');
      // 356 + 128 has only units->tens carry; hundreds carry should remain off.
      record('hundreds-carry-off',t2Carries.c2_hundreds===false);
      // Fill original two-digit 47+25.
      for(const [id,digit] of [['t2_q1_u','2'],['t2_q1_t','7']]){
        selectInputSlot(id,1);handleNumpadPress(digit);await sleep(165);
      }
      record('value-72',inputValues.t2_q1_u==='2'&&inputValues.t2_q1_t==='7');
      // Test original grading, and separately check whether it depends on carry state.
      toggleCarry('c1_tens');await sleep(100);
      const fullCarry=t2Carries.c1_tens&&t2Carries.c2_tens;
      checkCurrentExercise();
      const successBanner=document.getElementById('feedbackBanner');
      const passWithCarry=successBanner.classList.contains('bg-emerald-100');
      record('grade-with-carry',passWithCarry&&fullCarry);
      toggleCarry('c1_tens');await sleep(100); // incorrect carry, answers unchanged
      checkCurrentExercise();
      const passWithoutCarry=successBanner.classList.contains('bg-emerald-100');
      record('grade-with-wrong-carry',passWithoutCarry);
      record('original-carry-grading-gap',passWithoutCarry);
      const required=['fields','original-2-column','original-3-column','auto-ones-to-tens','auto-tens-to-hundreds','value-484','toggle-carry-1','carry-preserves-answer','hundreds-carry-off','value-72','grade-with-carry'];
      const checks=required.every(k=>root.getAttribute('data-v11-'+k)===(k==='fields'?'5':'true'));
      record('success',checks);
      record('html-scroll-overflow',document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
      record('stage-scroll-overflow',document.getElementById('interactiveStage').scrollWidth>document.getElementById('interactiveStage').clientWidth+1);
    }catch(e){fail(e)}
  },{once:true});
})();
