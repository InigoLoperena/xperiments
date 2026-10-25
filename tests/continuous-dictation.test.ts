import test from "node:test";
import assert from "node:assert/strict";
import { DICTATION_MAX_MS, startTwoMinuteDictation, type DictationEngine } from "../lib/continuous-dictation";

test("Voice dictation has a two-minute limit and allows manual stopping",()=>{
  assert.equal(DICTATION_MAX_MS, 120_000);
  let started=0, stopped=0;
  let finished="";
  const voice:DictationEngine={
    start:()=>{started++;},
    stop:()=>{stopped++;},
    onend:null, onerror:null,
  };
  const session=startTwoMinuteDictation(voice,reason=>{finished=reason;},()=>{});
  assert.equal(started,1);
  session.stop();
  session.stop();
  assert.equal(stopped,1);
  assert.equal(finished,"manual");
});

test("Microphone permission errors end a recording",()=>{
  let finished="",message="";
  const voice:DictationEngine={start:()=>{},stop:()=>{},onend:null,onerror:null};
  startTwoMinuteDictation(voice,reason=>{finished=reason;},error=>{message=error;});
  voice.onerror?.({error:"not-allowed"});
  assert.equal(finished,"error");
  assert.match(message,/Permite el acceso/);
});

test("Silence does not finish the two-minute session",()=>{
  let finished="";
  const voice:DictationEngine={start:()=>{},stop:()=>{},onend:null,onerror:null};
  const session=startTwoMinuteDictation(voice,reason=>{finished=reason;},()=>{});
  voice.onerror?.({error:"no-speech"});
  assert.equal(finished,"");
  session.stop();
});
