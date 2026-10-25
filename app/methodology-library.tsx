import {ChevronDown,ExternalLink} from 'lucide-react';
import {methodologyBooks} from '@/lib/methodology-library';

export function MethodologyLibrary() {
  return <details className="methodology-library">
    <summary aria-label="Ver libros, descripciones y enlaces de Amazon">
      <span className="methodology-library-copy">
        <span>La IA de Experiments tiene integrada los conocimientos de los mejores libros que te ayudarán a formular hipótesis, diseñar experimentos o guiar investigaciones, a hacerte las preguntas correctas para validar tu propuesta de valor y modelo de negocio. Aprendera de todos tus experimentos, hipótesis y aprendizajes sobre todo si conectas plataformas externas como google ads, meta ads o Posthog (para hacer experimentos a/b en webs y apps) Asi podras visualizar datos de todos tus experimentos y tu IA de Xperiments se volvera cada vez mas inteligente.</span>
        <span>Importa información y contexto relevante de tus proyectos, cualitativo o cuantitativo, en archivos CSV, PDF, DOCX o TXT para darle contexto desde el inicio.</span>
      </span>
      <span className="methodology-library-trigger">
        <span className="methodology-cover-preview">{methodologyBooks.slice(0,3).map(book =>
          <img key={book.id} src={book.cover} width={book.coverWidth} height={book.coverHeight} decoding="async" alt={`Portada de ${book.title}`}/>
        )}</span>
        <span className="methodology-library-link">Ver libros <ChevronDown size={15} aria-hidden="true" /></span>
      </span>
    </summary>
    <div className="methodology-library-body">
      <div className="methodology-books">{methodologyBooks.map(book => <article className="methodology-book" key={book.id}>
        <img src={book.cover} width={book.coverWidth} height={book.coverHeight} loading="lazy" decoding="async" alt={`Portada de ${book.title}`}/>
        <div className="methodology-book-copy">
          <h3>{book.title}</h3>
          <p className="methodology-book-author">{book.author}</p>
          <p>{book.description}</p>
          <small>{book.edition}</small>
          <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" aria-label={`Comprar ${book.title} en Amazon (se abre en otra pestaña)`}>Comprar en Amazon <ExternalLink size={14} aria-hidden="true"/></a>
        </div>
      </article>)}</div>
    </div>
  </details>;
}
