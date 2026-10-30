import { ArrowLeft, CheckCircle2, FlaskConical, Lightbulb, MessageCircleMore, Microscope, Search, AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import { AIBrainIcon } from './ai-brain-icon';

/** Responsive, accessible vector diagrams, matching the approved landing references.
 * All copy is in the DOM so the ES/EN language selector can translate it. */
export function DiscoveryFlowBanner() {
 return <div className="xl-graphic xl-discovery" role="group" aria-label="Problema u oportunidad, hipótesis, experimento e investigación">
  <div className="xl-discovery-left">
   <div className="xl-graphic-card xl-discovery-problem">
    <Search className="xl-graphic-symbol" size={44} strokeWidth={1.8} aria-hidden="true"/>
    <div><strong>PROBLEMA O OPORTUNIDAD</strong><p>Identificar el reto o la oportunidad</p></div>
   </div>
   <div className="xl-discovery-hypothesis">
    <div className="xl-graphic-card xl-hypothesis-card">
     <Lightbulb className="xl-graphic-symbol" size={47} strokeWidth={1.8} aria-hidden="true"/>
     <div><strong>HIPÓTESIS</strong><p>Cambio de mejora o solución a validar</p></div>
    </div>
   </div>
  </div>
  <div className="xl-discovery-right">
   <div className="xl-graphic-card xl-discovery-experiment">
    <FlaskConical className="xl-graphic-symbol" size={44} strokeWidth={1.8} aria-hidden="true"/>
    <div><strong>EXPERIMENTO</strong><p>Pruebas prácticas rápidas. Guiado por la IA de Xperiments y tus datos e información.</p></div>
   </div>
   <div className="xl-graphic-card xl-discovery-research">
    <Microscope className="xl-graphic-symbol" size={44} strokeWidth={1.8} aria-hidden="true"/>
    <div><strong>INVESTIGACIÓN</strong><p>Estudio y análisis profundo. Guiado por la IA de Xperiments y tus datos e información.</p></div>
   </div>
  </div>
 </div>;
}

function DriveMark(){
 return <svg className="xl-source-logo" viewBox="0 0 48 44" aria-hidden="true">
  <path fill="#00ac47" d="M17 3h11L10 36H0z"/><path fill="#ffba00" d="M28 3 48 36H35L17 3z"/><path fill="#4285f4" d="M10 36h38l-6 8H5z"/>
 </svg>;
}
function SheetMark(){
 return <span className="xl-sheets-mark" aria-hidden="true">X</span>;
}
export function ScatteredKnowledgeBanner(){
 return <div className="xl-graphic xl-scattered" role="group" aria-label="Información dispersa en Drive, chat y Excel que obliga a empezar de cero">
  <div className="xl-scattered-row"><DriveMark/><span>entrevistas.docx en Drive</span></div>
  <div className="xl-scattered-row"><MessageCircleMore size={29} className="xl-chat-mark" aria-hidden="true"/><span>Chat: «creo que eso ya lo probamos»</span></div>
  <div className="xl-scattered-row"><SheetMark/><span>Excel en PC de empleado</span></div>
  <div className="xl-scattered-row xl-scattered-warning"><AlertCircle size={30} aria-hidden="true"/><ArrowLeft className="xl-undo" size={23} aria-hidden="true"/><span>Vuelves a empezar de cero.</span></div>
 </div>;
}

function TreeStep({type,heading,body,description,icon}:{
 type:string;heading:string;body?:string;description?:string;icon:ReactNode
}){
 return <div className={`xl-graphic-card xl-tree-step xl-tree-${type}`}>
   <span className="xl-tree-step-icon">{icon}</span>
   <div><span className="xl-tree-label">{heading}</span>{body&&<strong>{body}</strong>}{description&&<p>{description}</p>}</div>
  </div>;
}
export function ConnectedKnowledgeBanner(){
 return <div className="xl-graphic xl-connected-tree" role="group" aria-label="De un problema a una hipótesis, investigación, experimento, aprendizaje y nueva propuesta de IA">
  <div className="xl-tree-single xl-tree-origin">
   <TreeStep type="problem" heading="PROBLEMA U OPORTUNIDAD" body="Los clientes abandonan la landing" icon={<Search size={26} strokeWidth={1.9}/>}/>
  </div>
  <div className="xl-tree-stem xl-tree-stem-problem"/>
  <div className="xl-tree-single">
   <TreeStep type="hypothesis" heading="HIPÓTESIS" body="Explicar el beneficio concreto visualmente" icon={<Lightbulb size={26} strokeWidth={1.9}/>}/>
  </div>
  <div className="xl-tree-fork-connector" aria-hidden="true"><span/><span/></div>
  <div className="xl-tree-branches">
   <TreeStep type="research" heading="INVESTIGACIÓN" body="Mostrarlo en videollamadas con clientes" description="Descubrir motivaciones y objeciones." icon={<Microscope size={26} strokeWidth={1.9}/>}/>
   <TreeStep type="experiment" heading="EXPERIMENTO" body="Test A/B versión actual VS nueva versión landing" description="Medir registros y contrastar la hipótesis." icon={<FlaskConical size={26} strokeWidth={1.9}/>}/>
  </div>
  <div className="xl-tree-merge" aria-hidden="true"/>
  <div className="xl-tree-single">
   <TreeStep type="result" heading="RESULTADO Y APRENDIZAJE REGISTRADO" icon={<CheckCircle2 size={26} strokeWidth={1.9}/>}/>
  </div>
  <div className="xl-tree-stem xl-tree-stem-ai"/>
  <div className="xl-tree-ai">
   <span className="xl-tree-ai-icon"><AIBrainIcon size={38}/></span>
   <div><span>IA PROPONE</span><strong>Siguiente hipótesis, problema, oportunidad, investigación o experimento</strong></div>
  </div>
 </div>;
}
