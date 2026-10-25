import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('Superadministrador menu follows Cómo utilizar and requires the site-editor grant',async()=>{
 const source=await readFile(new URL('../app/workspace-app.tsx',import.meta.url),'utf8');
 const menu=source.indexOf('{ id: "superadmin", label: "Superadministrador"');
 const method=source.indexOf('{ id: "method", label: "Cómo utilizar Xperiments"');
 assert.ok(menu>method);
 assert.match(source,/\{nav\.map\(\(\{ id, label, icon: I \}\) => \(/);
 assert.match(source,/id === "superadmin" && !siteBlogEditor \? null/);
 assert.match(source,/supabase\.rpc\('is_blog_editor'\)/);
 assert.match(source,/blogAdminGrant\?\.userId === user\.id && blogAdminGrant\.allowed/);
 assert.match(source,/view === "superadmin"[\s\S]*?siteBlogEditor[\s\S]*?<SiteAdminBlog/);
});

test('Superadmin content reuses blog editor with protected backend',async()=>{
 const [panel,api]=await Promise.all([
  readFile(new URL('../app/site-admin-blog.tsx',import.meta.url),'utf8'),
  readFile(new URL('../app/api/blog/route.ts',import.meta.url),'utf8'),
 ]);
 assert.match(panel,/<BlogEditor\s*\/>/);
 assert.match(api,/rpc\('is_blog_editor'\)/);
 assert.match(api,/permission\.data!==true/);
});
