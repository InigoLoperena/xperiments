'use client';
import {BlogEditor} from './blog/administrar/editor';

/** Reuse the existing secured editor inside the workspace. */
export function SiteAdminBlog(){
 return <section className="superadmin-blog" aria-label="Administrar blog">
  <h2>Artículos del blog</h2>
  <BlogEditor/>
 </section>;
}
