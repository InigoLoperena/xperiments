'use client';
import { useEffect, useRef, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Mic, Square } from 'lucide-react';
import { startTwoMinuteDictation, type DictationEngine, type DictationSession } from '@/lib/continuous-dictation';

type SpeechResult={resultIndex:number;results:ArrayLike<ArrayLike<{transcript:string}>>};
type Recognition=DictationEngine&{lang:string;continuous:boolean;interimResults:boolean;onresult:((e:SpeechResult)=>void)|null};
type SpeechWindow=Window&{SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition};

function DictationButton({target}:{target:HTMLInputElement|HTMLTextAreaElement}){
 const session=useRef<DictationSession|null>(null);
 const [recording,setRecording]=useState(false);
 const [message,setMessage]=useState('');
 useEffect(()=>()=>{session.current?.stop();session.current=null;},[]);
 function toggle(){
  if(session.current){session.current.stop();return;}
  const browser=window as SpeechWindow;
  const Constructor=browser.SpeechRecognition||browser.webkitSpeechRecognition;
  if(!Constructor){setMessage('El dictado necesita un navegador compatible');return;}
  const voice=new Constructor();voice.lang='es-ES';voice.continuous=true;voice.interimResults=false;
  voice.onresult=e=>{
   if(!target.isConnected||target.disabled||target.readOnly)return;
   const spoken=Array.from(e.results).slice(e.resultIndex).map(result=>result[0]?.transcript||'').join(' ').trim();
   if(!spoken)return;
   const next=(target.value.trim()?target.value.trimEnd()+' ':'')+spoken;
   if(target.maxLength>=0&&next.length>target.maxLength)return;
   const proto=target instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
   Object.getOwnPropertyDescriptor(proto,'value')?.set?.call(target,next);
   target.dispatchEvent(new Event('input',{bubbles:true}));
  };
  setMessage('');
  try{
   session.current=startTwoMinuteDictation(voice,
    reason=>{session.current=null;setRecording(false);if(reason==='timeout')setMessage('Dictado finalizado tras 2 minutos');},
    message=>setMessage(message));
   setRecording(true);
  }catch{setMessage('No se pudo iniciar el micrófono.');setRecording(false);}
 }
 return <button type="button" className={'global-dictation-button'+(recording?' is-recording':'')}
  aria-label={recording?'Detener dictado':'Dictar texto'}
  title={message|| (recording?'Detener dictado (máximo 2 minutos)':'Dictar texto hasta 2 minutos')}
  onClick={toggle}>{recording?<Square size={16}/>:<Mic size={16}/>}</button>;
}

/** Adds dictation to editable text fields, including dialogs mounted after initial load. */
export function GlobalDictation(){
 useEffect(()=>{
  const roots=new Map<HTMLElement,Root>();
  const eligible=(el:Element):el is HTMLInputElement|HTMLTextAreaElement=>{
   if(el instanceof HTMLTextAreaElement)return !el.readOnly&&!el.disabled&&!el.closest('.ai-prompt-composer, .voice-input');
   if(!(el instanceof HTMLInputElement))return false;
   return ['text','search','url','email','tel'].includes(el.type)&&!el.readOnly&&!el.disabled&&!el.closest('.ai-prompt-composer, .voice-input');
  };
  const scan=()=>{
   document.querySelectorAll('input,textarea').forEach(el=>{
    if(!eligible(el)||el.dataset.dictationAttached)return;
    const wrapper=document.createElement('span');wrapper.className='global-dictation-slot';
    el.insertAdjacentElement('afterend',wrapper);el.dataset.dictationAttached='true';
    const root=createRoot(wrapper);roots.set(wrapper,root);root.render(<DictationButton target={el}/>);
   });
   for(const [slot,root] of roots){if(!slot.isConnected){root.unmount();roots.delete(slot);}}
  };
  scan();const observer=new MutationObserver(()=>requestAnimationFrame(scan));
  observer.observe(document.body,{childList:true,subtree:true});
  return()=>{observer.disconnect();for(const root of roots.values())root.unmount();roots.clear();};
 },[]);
 return null;
}
