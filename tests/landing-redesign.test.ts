import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { productFaqs } from "../lib/product-content";
import { methodologyBooks } from "../lib/methodology-library";

test("landing keeps original hero preview and existing FAQ component and leaves footer in shared shell",async()=>{
 const [page,shell] = await Promise.all([
  readFile(new URL("../app/page.tsx",import.meta.url),"utf8"),
  readFile(new URL("../app/public-site-shell.tsx",import.meta.url),"utf8"),
 ]);
 for (const part of ["experiment-preview", "preview-window-bar", "preview-hypothesis", "preview-variants", "preview-learning"]) assert.ok(page.includes(part),part);
 assert.match(page,/productFaqs\.map\(faq=><details key=\{faq.question\}/);
 assert.ok(productFaqs.length>=5);
 assert.match(shell,/<PublicSiteFooter\/>/);
 assert.match(shell,/Cómo funciona/);
 assert.match(shell,/Blog/);
 assert.match(shell,/Recursos/);
 assert.match(shell,/Acceder/);
});

test("landing uses requested narrative and explicit primary and demo CTA routes",async()=>{
 const [page,workspace] = await Promise.all([
  readFile(new URL("../app/page.tsx",import.meta.url),"utf8"),
  readFile(new URL("../app/workspace-app.tsx",import.meta.url),"utf8"),
 ]);
 for(const phrase of ["Deja de decidir por intuición","MVPs Tree","Growth Tree","aprendizajes","hipótesis","Investigación","Experimento","Resultados","CSV","PDF","DOCX","TXT"])assert.ok(page.includes(phrase),phrase);
 assert.match(page,/href="\/proyectos\?signup=1">Probar gratis, sin tarjeta/);
 assert.match(page,/href="\/proyectos">\s*Ver demo/);
 assert.match(workspace,/params\.get\("signup"\) === "1"/);
 assert.match(workspace,/setAuthMode\("signup"\)/);
 for(const removed of ["DEL CONTEXTO A LA DECISIÓN","UN SISTEMA SENCILLO","LA IA \/ TU EQUIPO","ANTES DE EMPEZAR","Solicitar acceso","Entrar a mi espacio"])assert.ok(!page.includes(removed),removed);
});
test("diagram is accessible and matches real existing methodology sources and supported imports",async()=>{
 const page=await readFile(new URL("../app/page.tsx",import.meta.url),"utf8");
 assert.match(page,/role="group" aria-label="Ejemplo ilustrativo/);
 for(const n of ["landing-tree-problem","landing-tree-hypothesis","landing-tree-research","landing-tree-experiment","landing-tree-result","landing-system-intelligence"])assert.match(page,new RegExp(n));
 assert.match(page,/methodologyBooks\.map\(book=>/);
 assert.equal(methodologyBooks.length,3);
 assert.ok(methodologyBooks.every(book=>book.cover.startsWith("/methodology-books/")));
 const workspace=await readFile(new URL("../app/strategic-ai.tsx",import.meta.url),"utf8");
 assert.match(workspace,/\.txt,\.csv,\.json,\.md,\.pdf,\.docx/);
});
