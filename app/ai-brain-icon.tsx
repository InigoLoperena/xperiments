import { useId } from 'react';

/** Four-point Gemini-style diamond for every AI surface, replacing the former brain symbol. */
export function AIBrainIcon({size=20,className=''}:{size?:number;className?:string}) {
 const id=useId().replace(/:/g,'');
 return <svg width={size} height={size} viewBox="0 0 24 24" className={'ai-brain-icon '+className} aria-hidden="true" focusable="false">
  <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#5baeff"/><stop offset="50%" stopColor="#9c76f7"/><stop offset="100%" stopColor="#f18bb9"/></linearGradient></defs>
  <path d="M12 0.8C13.2 7.1 16.9 10.8 23.2 12c-6.3 1.2-10 4.9-11.2 11.2C10.8 16.9 7.1 13.2.8 12 7.1 10.8 10.8 7.1 12 .8Z" fill={`url(#${id})`}/>
 </svg>;
}
