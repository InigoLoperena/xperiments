import {
  ArrowRight, BarChart3, BookOpen, CheckCircle2, CircleDot, FileStack,
  FileText, FlaskConical, GitBranch, Layers, Lightbulb, Link2, Microscope,
  Search, Sparkles, Target, Users, Workflow,
} from 'lucide-react';
import { PublicSiteShell } from './public-site-shell';
import { DiscoveryFlowBanner, ScatteredKnowledgeBanner, ConnectedKnowledgeBanner } from './landing-diagrams';
import { AIBrainIcon } from './ai-brain-icon';
import { LegacyAuthBridge } from './legacy-auth-bridge';
import { productDefinition, productFaqs } from '@/lib/product-content';
import { methodologyBooks } from '@/lib/methodology-library';
import { SITE_URL, jsonLd, publicMetadata } from '@/lib/public-site';

const pageMetadata=publicMetadata({
 title:'Xperiments · Experimentación inteligente con IA, MVPs Tree y Growth Tree',
 description:'Aprende de cada experimento e investiga de forma inteligente. Metodología e IA con el contexto de tus proyectos, hipótesis y aprendizajes.',
 path:'/',
});
export const metadata={...pageMetadata,alternates:{...pageMetadata.alternates,types:{'text/markdown':'/producto.md'}}};

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
     <h1 id="landing-title">Aprende de cada experimento.<br/><span>Investiga de forma inteligente.</span></h1>
     <p className="landing-definition">Una metodología probada guiada por IA que utiliza el contexto de tus proyectos, hipótesis, experimentos y aprendizajes y Growth Tree para ayudarte a diseñar mejores estrategias para encontrar tu propuesta de valor, modelo de negocio o estrategia de crecimiento.</p>
     <LandingActions/>
    </div>
    <DiscoveryFlowBanner/>
   </section>

   <section className="landing-problem-block landing-section" aria-labelledby="problem-heading">
    <div className="landing-section-heading">
     <h2 id="problem-heading">Haces pruebas e investigaciones<br/><span>pero pierdes lo que aprendes.</span></h2>
     <p>Los resultados acaban en un documento de Notion, en un hilo de Slack o en una hoja de cálculo que nadie vuelve a abrir.</p>
     <p>Tres meses después, alguien propone la misma idea. Nadie recuerda que ya se probó. O peor: salió mal y se repite exactamente igual.</p>
     <p>Cuando preguntas a una IA, recibes consejos genéricos, porque no conoce tu proyecto ni sus pruebas anteriores.</p>
    </div>
    <ScatteredKnowledgeBanner/>
   </section>

   <section className="landing-section landing-connected" id="como-funciona" aria-labelledby="connected-heading">
    <div className="landing-section-heading landing-centered-heading">
     <h2 id="connected-heading">Un espacio donde <span>todo vive conectado.</span></h2>
     <p>Problemas, oportunidades, hipótesis, investigación, experimentos, resultados y aprendizaje colectivo. Cada prueba, investigación y resultados quedan atados a lo que querías comprobar y a lo que ocurrió. Deja de guiarte por opiniones e intuición y acércate a la verdad del mercado más rápidamente.</p>
    </div>
    <ConnectedKnowledgeBanner/>
   </section>

   <section className="landing-section landing-ai-section" aria-labelledby="ai-heading">
    <div className="landing-ai-copy">
     <h2 id="ai-heading">Tu IA no debería <span>empezar de cero.</span></h2>
     <p>La IA de Xperiments combina el contexto disponible de tus proyectos, pruebas anteriores y conclusiones con principios metodológicos para ayudarte a formular hipótesis, guiar investigaciones y diseñar experimentos.</p>
     <p>Te ayuda a hacer las preguntas correctas para validar tu propuesta de valor, modelo de negocio o estrategia de marketing. Y puede proponerte la siguiente prueba partiendo de lo que ya sabes.</p>
     <div className="landing-ai-points"><span><AIBrainIcon size={18}/> Aprende del contexto documentado por tu equipo</span><span><BookOpen size={18} aria-hidden="true"/> Se apoya en síntesis metodológicas de libros de referencia</span></div>
    </div>
    <div className="landing-bookshelf landing-bookshelf-minimal">
     <div className="landing-book-covers">{methodologyBooks.map(book=>
       <figure key={book.id}><img src={book.cover} alt={'Portada de '+book.title} width={book.coverWidth} height={book.coverHeight} loading="lazy" decoding="async"/></figure>
     )}</div>
     <p>Metodologías integradas en la IA de Experiments.</p>
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
     <div className="landing-import-connection"><span/><span><AIBrainIcon size={17}/> Contexto disponible para la IA</span><span/></div>
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
