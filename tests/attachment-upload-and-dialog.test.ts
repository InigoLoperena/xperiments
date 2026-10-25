import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { attachmentFileType } from "../lib/attachments";
import { clickedOutsideDialog } from "../lib/dialog-backdrop";

test("Files in every record accept only images, PDF, DOCX and TXT",()=>{
 const valid:[string,string,string][]=[
  ["test.jpg","image/jpeg","image"],["test.JPEG","image/jpeg","image"],
  ["test.png","image/png","image"],["test.webp","image/webp","image"],
  ["test.gif","image/gif","image"],["test.pdf","application/pdf","pdf"],
  ["test.docx","application/vnd.openxmlformats-officedocument.wordprocessingml.document","docx"],
  ["test.txt","text/plain","txt"],
 ];
 for(const [name,type,kind] of valid)assert.equal(attachmentFileType({name,size:512,type}).kind,kind);
 for(const name of ["film.mp4","film.webm","photo.svg","file.exe"])
  assert.throws(()=>attachmentFileType({name,size:512,type:""}),/No se admiten vídeos/);
 assert.throws(()=>attachmentFileType({name:"note.txt",size:512,type:"video/mp4"}));
});

test("Backdrop clicks close a record modal but clicks inside do not",()=>{
 const rect={left:120,right:650,top:80,bottom:620};
 assert.equal(clickedOutsideDialog(true,80,300,rect),true);
 assert.equal(clickedOutsideDialog(true,350,700,rect),true);
 assert.equal(clickedOutsideDialog(true,350,300,rect),false);
 assert.equal(clickedOutsideDialog(false,80,300,rect),false);
 assert.equal(clickedOutsideDialog(true,120,300,rect),false);
});

test("Attachment picker and editing dialog use the updated validation and safe backdrop behavior",async()=>{
 const [ui,workspace,sql]=await Promise.all([
  readFile(new URL("../app/record-attachments.tsx",import.meta.url),"utf8"),
  readFile(new URL("../app/workspace-app.tsx",import.meta.url),"utf8"),
  readFile(new URL("../supabase/migrations/20261025124500_record_upload_types.sql",import.meta.url),"utf8"),
 ]);
 assert.match(ui,/accept="\.jpg,\.jpeg,\.png,\.webp,\.gif,\.pdf,\.docx,\.txt"/);
 assert.doesNotMatch(ui,/accept="[^"]*\.mp4/);
 assert.match(ui,/addFiles\(Array\.from\(e\.dataTransfer\.files\)\)/);
 assert.match(ui,/attachment\.kind === "video" && url/); // previous videos remain accessible
 assert.match(workspace,/clickedOutsideDialog\(/);
 assert.match(workspace,/if \(saving \|\| attachmentsBusy \|\| assistantBusy\) return/);
 assert.match(sql,/new\.kind='video' then/);
 assert.match(sql,/kind='txt' and mime_type='text\/plain'/);
 assert.match(sql,/allowed_mime_types=array\[/);
});
