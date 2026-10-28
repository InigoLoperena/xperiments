import {
  ArrowRight, BarChart3, BrainCircuit, BookOpen, CheckCircle2, CircleDot, FileStack,
  FileText, FlaskConical, GitBranch, Layers, Lightbulb, Link2, Microscope,
  Search, Sparkles, Target, Users, Workflow,
} from 'lucide-react';
import { PublicSiteShell } from './public-site-shell';
import { LegacyAuthBridge } from './legacy-auth-bridge';
import { productDefinition, productFaqs } from '@/lib/product-content';
import { methodologyBooks } from '@/lib/methodology-library';
import { SITE_URL, jsonLd, publicMetadata } from '@/lib/public-site';

const pageMetadata=publicMetadata({
 title:'Xperiments · Experimentación inteligente con IA, MVPs Tree y Growth Tree',
 description:'Una IA con contexto de tus hipótesis, investigaciones, experimentos y aprendizajes. Organiza tus pruebas en MVPs Tree y Growth Tree y deja de decidir por intuición.',
 path:'/',
});
export const metadata={...pageMetadata,alternates:{...pageMetadata.alternates,types:{'text/markdown':'/producto.md'}}};

function ExperimentationTreeBanner() {
 return <div className="landing-system-banner" role="group" aria-label="Ejemplo ilustrativo de un árbol de experimentación que conecta un problema, una hipótesis, una investigación, un experimento y un aprendizaje">
  <div className="landing-system-top">
   <span className="landing-system-breadcrumb"><span className="landing-system-brand"><GitBranch size={16} aria-hidden="true"/></span> Xperiments <span>/</span> MVPs Tree <span>/</span> Validación del mercado</span>
   <span className="landing-system-mode"><CircleDot size={12} aria-hidden="true"/> Ejemplo de flujo</span>
  </div>
  <div className="landing-system-content">
   <div className="landing-system-tree">
    <div className="landing-tree-node landing-tree-problem">
     <span className="landing-tree-icon"><Search size={18} aria-hidden="true"/></span>
     <div><small>PROBLEMA U OPORTUNIDAD</small><strong>Los clientes abandonan antes de registrarse</strong><p>Comprender qué impide dar el primer paso.</p></div>
    </div>
    <div className="landing-tree-nesting">
     <div className="landing-tree-node landing-tree-hypothesis">
      <span className="landing-tree-icon"><Lightbulb size={18} aria-hidden="true"/></span>
      <div><small>HIPÓTESIS</small><strong>Explicar el beneficio concreto aumentará el interés</strong><p>Una idea comprobable, no una conclusión.</p></div>
     </div>
     <div className="landing-tree-nesting landing-tree-fork">
      <div className="landing-tree-node landing-tree-research">
       <span className="landing-tree-icon"><Microscope size={18} aria-hidden="true"/></span>
       <div><small>INVESTIGACIÓN</small><strong>Entrevistas a clientes</strong><p>Descubrir motivaciones y objeciones.</p></div>
      </div>
      <div className="landing-tree-node landing-tree-experiment">
       <span className="landing-tree-icon"><FlaskConical size={18} aria-hidden="true"/></span>
       <div><small>EXPERIMENTO</small><strong>Test A/B de propuesta de valor</strong><p>Medir registros y contrastar la hipótesis.</p></div>
      </div>
     </div>
     <div className="landing-tree-result">
      <CheckCircle2 size={17} aria-hidden="true"/>
      <div><strong>Resultado + aprendizaje</strong><span>La evidencia vuelve al proyecto y orienta la siguiente prueba.</span></div>
     </div>
    </div>
   </div>
   <aside className="landing-system-intelligence">
    <div className="landing-intelligence-heading"><BrainCircuit size={26} aria-hidden="true"/><span>IA DE XPERIMENTS</span></div>
    <h3>No empieza de cero en cada conversación.</h3>
    <p>Consulta el contexto disponible, las hipótesis y los aprendizajes anteriores para ayudarte a decidir qué investigar o experimentar después.</p>
    <div className="landing-intelligence-facts">
     <span><CheckCircle2 size={15} aria-hidden="true"/> Qué creíamos</span>
     <span><CheckCircle2 size={15} aria-hidden="true"/> Qué probamos</span>
     <span><CheckCircle2 size={15} aria-hidden="true"/> Qué aprendimos</span>
    </div>
    <div className="landing-intelligence-response"><Sparkles size={18} aria-hidden="true"/><span>«Con lo que ya sabemos, esta es la siguiente hipótesis que merece comprobarse».</span></div>
   </aside>
  </div>
 </div>;
}

function LandingActions({secondary=false}:{secondary?:boolean}) {
 return <div className="public-actions landing-cta-actions">
  <a className="public-button" href="/proyectos?signup=1">Probar gratis, sin tarjeta <ArrowRight size={18} aria-hidden="true"/></a>
  <a className={secondary?"public-button landing-demo-button":"public-button landing-demo-button"} href="/proyectos">
   Ver demo <ArrowRight size={17} aria-hidden="true"/>
  </a>
 </div>;
}

export default function LandingPage() {
 const graph={'@context':'https://schema.org','@graph':[
  {'@type':'WebSite','@id':SITE_URL+'/#website',name:'Xperiments',url:SITE_URL,inLanguage:'es'},
  {'@type':'SoftwareApplication','@id':SITE_URL+'/#software',name:'Xperiments',url:SITE_URL,description:productDefinition,applicationCategory:'BusinessApplication',operatingSystem:'Web',inLanguage:'es',image:SITE_URL+'/opengraph-image',featureList:['MVPs Tree y Growth Tree','Hipótesis, investigaciones, experimentos y resultados conectados','IA con contexto del espacio de trabajo','Biblioteca metodológica','Importación de documentos para contexto']},
  {'@type':'FAQPage',mainEntity:productFaqs.map(faq=>({'@type':'Question',name:faq.question,acceptedAnswer:{'@type':'Answer',text:faq.answer}}))},
 ]};
 return <PublicSiteShell>
  <LegacyAuthBridge/>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(graph)}}/>
  <main id="contenido" className="public-main">
   <section className="landing-hero" aria-labelledby="landing-title">
    <div className="landing-hero-copy">
     <h1 id="landing-title">Deja de decidir por intuición.<br/><span>Aprende de cada experimento.</span></h1>
     <p className="landing-definition">Una IA que utiliza el contexto de tus experimentos, hipótesis y aprendizajes y la metodología Growth Tree para ayudarte a diseñar mejores estrategias de crecimiento.</p>
     <LandingActions/>
    </div>
    <div className="experiment-preview" aria-label="Ejemplo ilustrativo del flujo de un experimento">
     <div className="preview-window-bar"><span className="preview-window-dots" aria-hidden="true">● ● ●</span><span>UN EJEMPLO, DE PRINCIPIO A FIN</span></div>
     <div className="preview-project"><span className="preview-project-icon"><FlaskConical size={25} aria-hidden="true"/></span><div><small>EXPERIMENTO</small><h2>¿Qué propuesta conecta mejor?</h2></div><span className="preview-status">Por validar</span></div>
     <div className="preview-hypothesis"><span><Lightbulb size={16} aria-hidden="true"/> HIPÓTESIS</span><p>Un beneficio concreto generará más interés que una lista de funciones.</p></div>
     <div className="preview-variants"><div><span>A</span><p>Una tarea resuelta.<br/><strong>Menos tiempo perdido.</strong></p></div><div><span>B</span><p>Todas las funciones.<br/><strong>Más posibilidades.</strong></p></div></div>
     <div className="preview-metric"><span>Métrica principal</span><strong>Solicitudes de una demo</strong></div>
     <div className="preview-learning"><BrainCircuit size={24} aria-hidden="true"/><p>El resultado se documenta.<br/><strong>La siguiente prueba parte de lo aprendido.</strong></p></div>
    </div>
   </section>

   <section className="landing-problem-block landing-section" aria-labelledby="problem-heading">
    <div className="landing-section-heading">
     <h2 id="problem-heading">Haces pruebas.<br/><span>Pero pierdes lo que aprendes.</span></h2>
     <p>Los resultados acaban en un documento de Notion, en un hilo de Slack o en una hoja de cálculo que nadie vuelve a abrir.</p>
     <p>Tres meses después, alguien propone la misma idea. Nadie recuerda que ya se probó. O peor: salió mal y se repite exactamente igual.</p>
     <p>Y cuando preguntas a una IA, recibes consejos genéricos, porque no conoce tu proyecto ni sus pruebas anteriores.</p>
    </div>
    <div className="landing-fragmented" aria-label="Ilustración de resultados dispersos y aprendizaje perdido">
     <div className="landing-fragmented-head"><FileStack size={17} aria-hidden="true"/> Información repartida en herramientas diferentes</div>
     <div className="landing-fragmented-card"><span className="landing-fragmented-symbol"><FileText size={17} aria-hidden="true"/></span><div><small>DOCUMENTOS</small><strong>Resultados de entrevistas.docx</strong><span>Conclusiones sin vincular a ninguna hipótesis</span></div></div>
     <div className="landing-fragmented-card"><span className="landing-fragmented-symbol"><Users size={17} aria-hidden="true"/></span><div><small>MENSAJES DEL EQUIPO</small><strong>«Creo que eso ya lo probamos…»</strong><span>La conversación se pierde en el historial</span></div></div>
     <div className="landing-fragmented-card"><span className="landing-fragmented-symbol"><Layers size={17} aria-hidden="true"/></span><div><small>HOJAS DE CÁLCULO</small><strong>experiment_results_final_v3.csv</strong><span>Números sin contexto ni decisiones</span></div></div>
     <div className="landing-fragmented-outcome"><CircleDot size={17} aria-hidden="true"/><span>Sin memoria compartida, vuelves a empezar de cero.</span></div>
    </div>
   </section>

   <section className="landing-section landing-connected" id="como-funciona" aria-labelledby="connected-heading">
    <div className="landing-section-heading landing-centered-heading">
     <h2 id="connected-heading">Un espacio donde <span>todo vive conectado.</span></h2>
     <p>Problemas, hipótesis, investigación, experimentos, resultados y aprendizaje colectivo. Cada prueba queda atada a lo que querías comprobar y a lo que realmente ocurrió.</p>
    </div>
    <ExperimentationTreeBanner/>
   </section>

   <section className="landing-section landing-dual-trees" aria-labelledby="trees-heading">
    <div className="landing-section-heading">
     <h2 id="trees-heading">Investiga mejor. <span>Crece con estrategia.</span></h2>
     <p>Dos árboles para necesidades distintas, con los mismos problemas, hipótesis y experimentos siempre conectados.</p>
    </div>
    <div className="landing-tree-products">
     <article className="landing-tree-product landing-mvp-product">
      <div className="landing-tree-product-title"><Microscope size={24} aria-hidden="true"/><div><span>PARA VALIDAR UN MODELO DE NEGOCIO</span><h3>MVPs Tree</h3></div></div>
      <p>Investiga las necesidades del mercado antes de invertir en soluciones. Organiza problemas, formula hipótesis y contrástalas con investigación o experimentos.</p>
      <div className="landing-tree-product-stack"><span><Search size={15}/> Problemas u Oportunidades</span><span><Lightbulb size={15}/> Hipótesis</span><div><span><Microscope size={15}/> Investigación</span><span><FlaskConical size={15}/> Experimentos</span></div></div>
     </article>
     <article className="landing-tree-product landing-growth-product">
      <div className="landing-tree-product-title"><GitBranch size={24} aria-hidden="true"/><div><span>PARA ENFOCAR EL CRECIMIENTO</span><h3>Growth Tree</h3></div></div>
      <p>Conecta la North Star Metric y los objetivos estratégicos con oportunidades, hipótesis y experimentos para priorizar qué mueve realmente el negocio.</p>
      <div className="landing-tree-product-stack"><span><Target size={15}/> North Star Metric</span><span><CircleDot size={15}/> Objetivos / Input Metrics</span><span><Search size={15}/> Oportunidades → Hipótesis</span><span><FlaskConical size={15}/> Experimentos</span></div>
     </article>
    </div>
   </section>

   <section className="landing-section landing-ai-section" aria-labelledby="ai-heading">
    <div className="landing-ai-copy">
     <h2 id="ai-heading">Tu IA no debería <span>empezar de cero.</span></h2>
     <p>La IA de Xperiments combina el contexto disponible de tus proyectos, pruebas anteriores y conclusiones con principios metodológicos para ayudarte a formular hipótesis, guiar investigaciones y diseñar experimentos.</p>
     <p>Te ayuda a hacer las preguntas correctas para validar tu propuesta de valor, modelo de negocio o estrategia de marketing. Y puede proponerte la siguiente prueba partiendo de lo que ya sabes.</p>
     <div className="landing-ai-points"><span><BrainCircuit size={18} aria-hidden="true"/> Aprende del contexto documentado por tu equipo</span><span><BookOpen size={18} aria-hidden="true"/> Se apoya en síntesis metodológicas de libros de referencia</span><span><CheckCircle2 size={18} aria-hidden="true"/> Tú revisas las hipótesis y decisiones</span></div>
    </div>
    <div className="landing-bookshelf">
     <div className="landing-bookshelf-head"><BookOpen size={20} aria-hidden="true"/><div><strong>Conocimiento para preguntar mejor</strong><span>Metodología integrada en la IA</span></div></div>
     <div className="landing-book-covers">{methodologyBooks.map(book=>
       <figure key={book.id}><img src={book.cover} alt={'Portada de '+book.title} width={book.coverWidth} height={book.coverHeight} loading="lazy" decoding="async"/><figcaption>{book.title}</figcaption></figure>
     )}</div>
     <p>Referencias metodológicas y síntesis propias para investigar clientes, pensar el go-to-market y convertir hipótesis en decisiones basadas en evidencia.</p>
    </div>
   </section>

   <section className="landing-import-section landing-section" aria-labelledby="import-heading">
    <div className="landing-section-heading">
     <h2 id="import-heading">Haz que tu IA <span>entienda tu negocio.</span></h2>
     <p>Importa información cualitativa o cuantitativa de tus proyectos: entrevistas, documentos, resultados, investigaciones y datos de tus campañas. Cuanto mejor esté documentado el contexto, mejores preguntas podrá ayudarte a formular.</p>
     <a className="public-text-link" href="/guia-investigacion">Cómo importar información y realizar investigaciones <ArrowRight size={17} aria-hidden="true"/></a>
    </div>
    <div className="landing-import-visual">
     <div className="landing-import-bar"><FileStack size={18} aria-hidden="true"/><strong>Contexto del proyecto</strong><span>Importar</span></div>
     <div className="landing-import-files">
      {[
       {ext:"CSV",desc:"Datos y métricas"},
       {ext:"PDF",desc:"Informes e investigaciones"},
       {ext:"DOCX",desc:"Entrevistas y conclusiones"},
       {ext:"TXT",desc:"Notas y observaciones"},
      ].map(file=><div key={file.ext}><FileText size={21} aria-hidden="true"/><strong>{file.ext}</strong><small>{file.desc}</small></div>)}
     </div>
     <div className="landing-import-connection"><span/><span><BrainCircuit size={17} aria-hidden="true"/> Contexto disponible para la IA</span><span/></div>
     <div className="landing-import-output"><Sparkles size={17} aria-hidden="true"/><span>Respuestas y propuestas con el conocimiento real de tus proyectos.</span></div>
    </div>
   </section>


   <section className="landing-section landing-api-section" aria-labelledby="api-heading">
    <div className="landing-section-heading landing-centered-heading">
     <h2 id="api-heading">Integra tus herramientas y APIs. <span>Todos tus datos en un panel.</span></h2>
     <p>Conecta PostHog, Meta Ads y Google Ads para consultar las métricas de tus experimentos y campañas desde un único lugar. Utiliza esos resultados para aportar contexto real a la IA de Xperiments.</p>
    </div>
    <div className="landing-api-flow" role="group" aria-label="Las herramientas conectadas envían sus métricas a un panel unificado que aporta contexto a la IA">
     <div className="landing-api-sources">
      <div className="landing-api-source"><span className="landing-api-source-icon"><CircleDot size={21} aria-hidden="true"/></span><div><strong>PostHog</strong><small>Eventos, embudos y experimentos</small></div></div>
      <div className="landing-api-source"><span className="landing-api-source-icon"><Target size={21} aria-hidden="true"/></span><div><strong>Meta Ads</strong><small>Campañas y rendimiento</small></div></div>
      <div className="landing-api-source"><span className="landing-api-source-icon"><BarChart3 size={21} aria-hidden="true"/></span><div><strong>Google Ads</strong><small>Tráfico y conversiones</small></div></div>
     </div>
     <span className="landing-api-arrow" aria-hidden="true"><ArrowRight size={25}/></span>
     <div className="landing-api-panel">
      <span className="landing-api-label"><Workflow size={17} aria-hidden="true"/> PANEL ÚNICO</span>
      <h3>Tus métricas, en contexto</h3>
      <p>Consulta los datos disponibles de tus campañas y experimentos junto a la hipótesis que estás validando.</p>
      <div className="landing-api-metrics"><span>Conversiones</span><span>CTR</span><span>Registros</span></div>
     </div>
     <span className="landing-api-arrow" aria-hidden="true"><ArrowRight size={25}/></span>
     <div className="landing-api-ai">
      <span className="landing-api-label"><Sparkles size={17} aria-hidden="true"/> IA DE XPERIMENTS</span>
      <h3>Decisiones basadas en datos</h3>
      <p>La IA puede combinar las métricas conectadas con tus hipótesis y aprendizajes para ayudarte a interpretar resultados y plantear el siguiente experimento.</p>
     </div>
    </div>
    <p className="landing-api-note"><Link2 size={15} aria-hidden="true"/> La disponibilidad de datos depende de las conexiones, permisos y capacidades de cada plataforma.</p>
   </section>

   <section className="landing-section landing-advantage" aria-labelledby="advantage-heading">
    <div className="landing-advantage-header">
     <h2 id="advantage-heading">La experimentación inteligente te ayuda a entender qué necesita el mercado y a diseñar mejores estrategias.</h2>
    </div>
   </section>

   <section className="landing-section landing-faq" aria-labelledby="faq-heading"><div className="landing-section-heading"><p className="public-eyebrow">TUS PREGUNTAS</p><h2 id="faq-heading">Preguntas frecuentes</h2></div><div>{productFaqs.map(faq=><details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>

   <section className="landing-final landing-final-new" aria-labelledby="final-cta-heading">
    <h2 id="final-cta-heading">Deja de decidir por intuición.<br/><span>Empieza a aprender de cada prueba.</span></h2>
    <p>Una misma memoria para tu equipo, tus experimentos y la IA que te ayuda a avanzar.</p>
    <LandingActions secondary/>
   </section>
  </main>
 </PublicSiteShell>;
}
