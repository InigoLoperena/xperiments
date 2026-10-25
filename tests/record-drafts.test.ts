import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { recordDraftKey, saveRecordDraft, restoreRecordDraft, clearRecordDraft } from "../lib/record-drafts";
import type { Item } from "../lib/model";

function store() {
  const data = new Map<string,string>();
  return {
    getItem:(key:string)=>data.get(key)??null,
    setItem:(key:string,value:string)=>{data.set(key,value);},
    removeItem:(key:string)=>{data.delete(key);},
  };
}
function record(kind:Item["kind"]="hypothesis", project_id="project-a"):Item {
  return {
    id:"new-id",workspace_id:"space-a",project_id,kind,parent_id:null,
    related_id:null,title:"",owner_id:null,fields:{description:""},
    created_at:"now",updated_at:"now",created_by:"alice",updated_by:"alice",
  };
}

test("A new hypothesis restores title, description, selection and relationships",()=>{
  const storage=store();
  const initial=record();
  saveRecordDraft({...initial,title:"Hipótesis pendiente",parent_id:"problem-a",
    owner_id:"alice",fields:{description:"Texto redactado",impact:7,is_main_hypothesis:true}}, "alice", storage);
  const result=restoreRecordDraft(record(),"alice",storage);
  assert.equal(result?.title,"Hipótesis pendiente");
  assert.equal(result?.fields.description,"Texto redactado");
  assert.equal(result?.fields.impact,7);
  assert.equal(result?.fields.is_main_hypothesis,true);
  assert.equal(result?.parent_id,"problem-a");
  assert.equal(result?.owner_id,"alice");
  assert.equal(result?.id,"new-id");
});

test("Drafts are isolated by account, workspace, project and kind",()=>{
  const storage=store();
  saveRecordDraft({...record(),title:"Borrador"},"alice",storage);
  assert.equal(restoreRecordDraft(record(),"bob",storage),null);
  assert.equal(restoreRecordDraft(record("experiment"),"alice",storage),null);
  assert.equal(restoreRecordDraft(record("hypothesis","project-b"),"alice",storage),null);
  assert.equal(restoreRecordDraft({...record(),workspace_id:"space-b"},"alice",storage),null);
});

test("Input metrics and objectives have separate drafts",()=>{
  const storage=store();
  const objective={...record("goal"),fields:{goi_section:"objectives"}};
  const metric={...record("goal"),fields:{goi_section:"input_metrics"}};
  assert.notEqual(recordDraftKey(objective,"alice"),recordDraftKey(metric,"alice"));
  saveRecordDraft({...metric,title:"Registros"},"alice",storage);
  assert.equal(restoreRecordDraft(objective,"alice",storage),null);
  assert.equal(restoreRecordDraft(metric,"alice",storage)?.title,"Registros");
});

test("Successful saves clear cached drafts; corrupt data fails safely",()=>{
  const storage=store(); const item=record();
  saveRecordDraft({...item,title:"Borrador"},"alice",storage);
  clearRecordDraft(item,"alice",storage);
  assert.equal(restoreRecordDraft(item,"alice",storage),null);
  storage.setItem(recordDraftKey(item,"alice"),"{");
  assert.equal(restoreRecordDraft(item,"alice",storage),null);
});

test("Creation editor saves, restores, clears drafts and labels buttons by kind",async()=>{
  const code=await readFile(new URL("../app/workspace-app.tsx",import.meta.url),"utf8");
  assert.match(code,/saveRecordDraft\(draft, user\?\.id\)/);
  assert.match(code,/restoreRecordDraft\(freshDraft, user\?\.id\)/);
  assert.match(code,/clearRecordDraft\(draft, user\?\.id\)/);
  assert.match(code,/Guardar \$\{draft\.kind/);
});
