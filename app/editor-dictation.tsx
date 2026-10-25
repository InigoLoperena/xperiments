'use client';
import {useEffect,useRef,useState} from 'react';
import {Mic,Square} from 'lucide-react';

type SpeechEvent={resultIndex:number;results:ArrayLike<ArrayLike<{transcript:string;confidence?:number}>>};
type Recognition={lang:string;continuous:boolean;interimResults:boolean;onresult:((event:SpeechEvent)=>void)|null;onerror:(()=>void)|null;onend:(()=>void)|null;start:()=>void;stop:()=>void};
type SpeechWindow=Window&{SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition};
type TextField=HTMLInputElement|HTMLTextAreaElement;
const valid=(element:EventTarget|null):element is TextField=>{
 if(element instanceof HTMLTextAreaElement)return !element.disabled&&!element.readOnly;
 return element instanceof HTMLInputElement&&['text','search','url','email','tel'].includes(element.type)&&!element.disabled&&!element.readOnly;
};

export function EditorDictation(){
 const control=useRef<HTMLDivElement|null>(null);
 const lastField=useRef<TextField|null>(null);
 const recognition=useRef<Recognition|null>(null);
 const [recording,setRecording]=useState(false);
 const [selected,setSelected]=useState(true);
 const [error,setError]=useState('');
 useEffect(()=>{
  const form=control.current?.closest('form');
  if(!form){setSelected(false);return;}
  const title=form.querySelector('[data-record-title]');
  if(valid(title)){lastField.current=title;}else{setSelected(false);}
  const remember=(event:Event)=>{
   if(valid(event.target)&&form.contains(event.target)){
    lastField.current=event.target;setSelected(true);
   }
  };
  form.addEventListener('focusin',remember,true);
  form.addEventListener('pointerdown',remember,true);
  return()=>{
   form.removeEventListener('focusin',remember,true);form.removeEventListener('pointerdown',remember,true);
   const voice=recognition.current;recognition.current=null;lastField.current=null;
   if(voice){voice.onresult=null;voice.onerror=null;voice.onend=null;try{voice.stop();}catch{}}
  };
 },[]);
 function toggle(){
  if(recognition.current){recognition.current.stop();return;}
  const form=control.current?.closest('form');
  const previous=lastField.current;
  const field=valid(previous)&&previous.isConnected&&form?.contains(previous)?previous:form?.querySelector('[data-record-title]')??null;
  if(!valid(field)){setSelected(false);setError('Selecciona un campo de texto editable.');return;}
  lastField.current=field;setSelected(true);
  const browser=window as SpeechWindow;
  const Constructor=browser.SpeechRecognition||browser.webkitSpeechRecognition;
  if(!Constructor){setError('El navegador no admite dictado por voz.');return;}
  setError('');
  const voice=new Constructor();
  voice.lang='es-ES';voice.continuous=true;voice.interimResults=false;
  voice.onresult=event=>{
   if(recognition.current!==voice)return;
   const target=lastField.current;
   if(!target||!target.isConnected||target.disabled||target.readOnly||!form?.contains(target))return;
   const spoken=Array.from(event.results).slice(event.resultIndex).map(result=>result[0]?.transcript||'').join(' ').trim();
   if(!spoken)return;
   const begin=target.selectionStart??target.value.length;
   const end=target.selectionEnd??target.value.length;
   const prefix=target.value.slice(0,begin);
   const suffix=target.value.slice(end);
   const insertion=(prefix&&!/\s$/.test(prefix)?' ':'')+spoken+(suffix&&!/^\s/.test(suffix)?' ':'');
   const next=prefix+insertion+suffix;
   if(target.maxLength>=0&&next.length>target.maxLength){setError('El campo ha alcanzado su límite de caracteres.');return;}
   const proto=target instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
   Object.getOwnPropertyDescriptor(proto,'value')?.set?.call(target,next);
   target.dispatchEvent(new Event('input',{bubbles:true}));
   const cursor=begin+insertion.length;
   try{target.setSelectionRange(cursor,cursor);}catch{}
  };
  const end=()=>{if(recognition.current===voice){recognition.current=null;setRecording(false);}};
  voice.onerror=()=>{setError('No se pudo reconocer la voz. Comprueba los permisos del micrófono.');end();};
  voice.onend=end;
  recognition.current=voice;setRecording(true);
  try{voice.start();}catch{end();setError('No se pudo iniciar el micrófono.');}
 }
 return <div ref={control} className="editor-dictation-control">
  <button type="button" className={'btn editor-dictation-trigger'+(recording?' recording':'')} onClick={toggle}
   disabled={!recording&&!selected} title={!selected?'No hay un campo de texto editable':recording?'Detener dictado':'Dictar en Título o en el último campo seleccionado'}
   aria-label={recording?'Detener dictado':'Dictar texto'}>
   {recording?<Square size={18}/>:<Mic size={20}/>} {recording?'Detener dictado':'Dictar texto'}
  </button>
  {error&&<span className="editor-dictation-error" role="alert">{error}</span>}
 </div>;
}
