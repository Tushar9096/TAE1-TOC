// Modular TM core for the copy-string transformation w -> w B w.
// B = blank separator. X/Y are temporary markers for original 0/1.
(function(global){
  const BLANK = '_';
  const SEPARATOR = 'B';
  const LEFT_MARK = '<';
  const INPUT = /^[01]+$/;

  function validateInput(w, maxLength=18){
    w = String(w ?? '').trim();
    if(!w) return {ok:false, message:'Enter a non-empty binary string.'};
    if(!INPUT.test(w)) return {ok:false, message:'Only 0 and 1 are allowed.'};
    if(w.length > maxLength) return {ok:false, message:`Keep input length at ${maxLength} symbols or fewer for a classroom demo.`};
    return {ok:true, value:w};
  }

  function createSimulator(w){
    const validation = validateInput(w);
    if(!validation.ok) throw new Error(validation.message);
    w = validation.value;

    const tape = [LEFT_MARK, ...w.split(''), BLANK, BLANK];
    let head = 1;
    let state = 'qInit';
    let step = 0;
    let saved = null;
    let halted = false;
    const trace = [];

    function emit(read, write, move, next, reason){
      const before = head;
      tape[head] = write;
      if(move === 'R') head++; else if(move === 'L') head--;
      trace.push({step:++step, state, read, write, head:before, move, next, reason});
      state = next;
      if(head < 0){ tape.unshift(LEFT_MARK); head = 0; }
      while(tape.length < 2) tape.push(BLANK);
      if(head >= tape.length-1) tape.push(BLANK);
    }

    function tick(){
      if(halted) return {done:true};
      const read = tape[head] ?? BLANK;

      if(state === 'qInit'){
        if(read === '0' || read === '1'){ emit(read, read, 'R', 'qInit', 'Scan to the end of the input.'); return {done:false}; }
        if(read === BLANK){ emit(read, SEPARATOR, 'L', 'qToLeft', 'End found; write B as the blank separator.'); return {done:false}; }
      }
      if(state === 'qToLeft'){
        if(read === LEFT_MARK){ emit(read, read, 'R', 'qFind', 'Return to the left boundary before the copy scan.'); return {done:false}; }
        emit(read, read, 'L', 'qToLeft', 'Move left to restart the copy scan.'); return {done:false};
      }
      if(state === 'qFind'){
        if(read === 'X' || read === 'Y'){ emit(read, read, 'R', 'qFind', 'Skip a source symbol already copied.'); return {done:false}; }
        if(read === '0'){ saved='0'; emit(read, 'X', 'R', 'qSeekEnd', 'Mark source 0 as X and carry 0.'); return {done:false}; }
        if(read === '1'){ saved='1'; emit(read, 'Y', 'R', 'qSeekEnd', 'Mark source 1 as Y and carry 1.'); return {done:false}; }
        if(read === SEPARATOR){ emit(read, read, 'L', 'qCleanupLeft', 'All source symbols are marked; the B separator has been reached.'); return {done:false}; }
      }
      if(state === 'qSeekEnd'){
        if(read === BLANK){ const symbol=saved; saved=null; emit(read, symbol, 'L', 'qToLeft', `Append ${symbol} at the right end.`); return {done:false}; }
        emit(read, read, 'R', 'qSeekEnd', 'Move right across the separator and copied area.'); return {done:false};
      }
      if(state === 'qCleanupLeft'){
        if(read === LEFT_MARK){ emit(read, read, 'R', 'qCleanup', 'Reached the left boundary; restore temporary markers.'); return {done:false}; }
        emit(read, read, 'L', 'qCleanupLeft', 'Move left to the beginning of the tape.'); return {done:false};
      }
      if(state === 'qCleanup'){
        if(read === 'X'){ emit(read, '0', 'R', 'qCleanup', 'Restore X -> 0.'); return {done:false}; }
        if(read === 'Y'){ emit(read, '1', 'R', 'qCleanup', 'Restore Y -> 1.'); return {done:false}; }
        if(read === '0' || read === '1' || read === SEPARATOR || read === BLANK){
          if(read === BLANK){
            halted = true;
            state = 'qAccept';
            trace.push({step:++step, state:'qCleanup', read:BLANK, write:BLANK, head, move:'—', next:'qAccept', reason:'Output completed: w B w.'});
            return {done:true};
          }
          emit(read, read, 'R', 'qCleanup', 'Leave an already restored output symbol unchanged.'); return {done:false};
        }
      }
      halted=true;
      return {done:true};
    }

    function runToCompletion(limit=100000){
      while(!halted && step < limit) tick();
      if(!halted) throw new Error('TM step limit exceeded.');
      return getOutput();
    }

    function getOutput(){
      return tape.slice(1).join('').replace(new RegExp(BLANK+'+$'),'');
    }

    function verify(){
      return getOutput() === `${w}${SEPARATOR}${w}`;
    }

    return {input:w, tape, trace, tick, runToCompletion, verify, getOutput:()=>getOutput(), get state(){return state;}, get head(){return head;}, get step(){return step;}, get halted(){return halted;}, get saved(){return saved;}};
  }

  global.TMCopy = {BLANK, SEPARATOR, LEFT_MARK, validateInput, createSimulator};
})(window);
