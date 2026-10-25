// Isolated browser QA: every Supabase/API request is fulfilled with synthetic
// fixtures. Never attach this runner to a real user browser or remote app.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { sectionPaths } from '../lib/section-routes.ts';

const require = createRequire(import.meta.url);
const { chromium } = require(require.resolve('playwright', { paths: [process.env.PLAYWRIGHT_MODULE_PATH || '.', process.cwd()] }));
const base = process.env.TEST_APP_URL || 'http://127.0.0.1:3107';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'Use a local app only.');
const output = new URL('../.vercel/audit-2026-10-23/', import.meta.url);
await mkdir(output, { recursive: true });
const workspace = { id: '11111111-1111-4111-8111-111111111111', name: 'Equipo QA' };
const user = { id: '22222222-2222-4222-8222-222222222222', aud: 'authenticated', role: 'authenticated', email: 'qa@example.invalid', user_metadata: { name: 'QA' }, app_metadata: {}, created_at: '2026-10-23T00:00:00Z' };
const projectId = '33333333-3333-4333-8333-333333333333';
const otherProjectId = '44444444-4444-4444-8444-444444444444';
const now = '2026-10-23T10:00:00Z';
const mk = (id, kind, title, fields = {}, parent_id = null, project_id = projectId) => ({ id, kind, title, fields, parent_id, project_id: kind === 'project' ? null : project_id, workspace_id: workspace.id, related_id: null, owner_id: user.id, created_by: user.id, updated_by: user.id, created_at: now, updated_at: now });
const fixtureRecords = () => [
  mk(projectId, 'project', 'Proyecto QA', { north_star: 'Acciones útiles' }),
  mk(otherProjectId, 'project', 'Otro proyecto QA', { north_star: 'Visitas' }),
  mk('55555555-5555-4555-8555-555555555555', 'opportunity', 'Problema QA', { is_problemon: true, description: 'Problema sintético' }),
  mk('66666666-6666-4666-8666-666666666666', 'hypothesis', 'Hipótesis QA', { description: 'Hipótesis sintética', is_main_hypothesis: true, impact: 5, confidence: 5, ease: 5 }, '55555555-5555-4555-8555-555555555555'),
  mk('77777777-7777-4777-8777-777777777777', 'experiment', 'Experimento QA', { context: 'Contexto propio', hypothesis: 'Hipótesis propia', metric: 'Clics', channel: 'meta_ads', impact: 5, confidence: 5, ease: 5 }, '66666666-6666-4666-8666-666666666666'),
  mk('88888888-8888-4888-8888-888888888888', 'research', 'Investigación QA', { description: 'Notas de entrevista', method: 'Entrevistas', findings: 'Hallazgo sintético' }),
  mk('99999999-9999-4999-8999-999999999999', 'experiment', 'Solo otro proyecto', { metric: 'Visitas' }, null, otherProjectId),
  mk('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'opportunity', 'Problema privado de otro proyecto', { is_problemon: true }, null, otherProjectId),
];
let records = fixtureRecords();
let attachments = [];
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5N0AAAAASUVORK5CYII=', 'base64');
const uploads = [];
let failUpload = '';
let writes = 0;
const browser = await chromium.launch({ headless: true, ...(process.env.TEST_BROWSER_PATH ? { executablePath: process.env.TEST_BROWSER_PATH } : {}) });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
const errors = [], checks = [], unexpected = [];
page.on('pageerror', error => errors.push(error.message));
const member = { user_id: user.id, workspace_id: workspace.id, role: 'owner', permissions: [], profiles: { id: user.id, name: 'QA', avatar_url: null } };
const fakeJwt = [Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'), Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600, aud: 'authenticated', role: 'authenticated' })).toString('base64url'), 'synthetic-signature'].join('.');
await context.addInitScript(({ session, ref }) => { localStorage.setItem(`sb-${ref}-auth-token`, JSON.stringify(session)); }, { ref: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0], session: { user, access_token: fakeJwt, refresh_token: 'synthetic-refresh', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600 } });
const fixtureRoute = async route => {
  const request = route.request(), url = new URL(request.url()), method = request.method();
  const json = async (body, status = 200, extra = {}) => route.fulfill({ status, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*', ...extra }, body: JSON.stringify(body) });
  if (url.origin === new URL(base).origin) {
    if (!url.pathname.startsWith('/api/')) return route.continue();
    if (url.pathname === '/api/integrations') return json({ connections: [], profiles: [], can_configure: true, storage_ready: true });
    // Provider/UI side panels may query their state; no real provider is called.
    return json({ resources: [], variants: [], observations: [], preparations: [], knowledge: [], entries: [] });
  }
  if (!url.hostname.endsWith('.supabase.co')) { unexpected.push(url.origin); return route.abort(); }
  if (method === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
  if (url.pathname.startsWith('/auth/')) return json({ user });
  if (url.pathname.startsWith('/storage/v1/object/sign/')) {
    if (method === 'POST') return json({ signedURL: url.pathname.replace('/storage/v1', '') + '?token=synthetic' });
    return route.fulfill({ status: 200, contentType: 'image/png', body: pixel, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
  if (url.pathname.startsWith('/storage/v1/object/record-attachments/')) {
    const storagePath = decodeURIComponent(url.pathname.split('/record-attachments/')[1]);
    const attachment = attachments.find(item => item.storage_path === storagePath);
    assert.ok(attachment && records.some(record => record.id === attachment.record_id), 'Save the record and reserve metadata before uploading its private file');
    uploads.push(attachment.name);
    if (attachment.name === failUpload) { failUpload = ''; return json({ statusCode: '400', error: 'SyntheticUpload', message: 'Fallo de subida simulado' }, 400); }
    return json({ Key: 'record-attachments/' + storagePath });
  }
  const table = url.pathname.split('/').at(-1);
  if (url.pathname.includes('/rpc/')) {
    if (table === 'get_public_preview') return json({ workspace, records, members: [], activity: [], attachments: [] });
    if (table === 'save_experiment_preparation') {
      const body = request.postDataJSON(), payload = body.p_record;
      const record = { ...mk(payload.id, 'experiment', payload.title), ...payload, updated_at: new Date().toISOString() };
      records = [...records.filter(r => r.id !== record.id), record]; writes++; return json([record]);
    }
    return json([]);
  }
  let rows = table === 'records' ? records : table === 'record_attachments' ? attachments : table === 'workspaces' ? [workspace] : table === 'members' ? [member] : table === 'profiles' ? [member.profiles] : [];
  for (const [key, value] of url.searchParams) if (value.startsWith('eq.')) rows = rows.filter(row => String(row[key]) === value.slice(3));
  if (method === 'POST' && table === 'records') {
    const body = request.postDataJSON(), payload = Array.isArray(body) ? body[0] : body;
    rows = [{ ...mk(payload.id, payload.kind, payload.title), ...payload }]; records.push(rows[0]); writes++;
  }
  if (method === 'POST' && table === 'record_attachments') {
    const payload = request.postDataJSON();
    assert.ok(records.some(record => record.id === payload.record_id && record.workspace_id === payload.workspace_id));
    rows = [{ ...payload, created_at: now, created_by: user.id }]; attachments.push(rows[0]);
  }
  if (method === 'DELETE' && table === 'record_attachments') attachments = attachments.filter(item => !rows.includes(item));
  if (method === 'PATCH' && table === 'records') {
    const payload = request.postDataJSON(); rows.forEach(row => Object.assign(row, payload, { updated_at: new Date().toISOString() })); writes++;
  }
  const single = request.headers().accept?.includes('vnd.pgrst.object');
  return json(single ? rows[0] || null : rows, 200, { 'Content-Range': `0-${Math.max(0, rows.length - 1)}/${rows.length}` });
};
await context.route('**/*', fixtureRoute);
await page.addInitScript(() => {
  window.qaDictationStarts = 0;
  window.SpeechRecognition = class {
    start() { window.qaDictation = this; window.qaDictationStarts++; }
    stop() { this.stopped = true; this.onend?.(); }
  };
});

async function navigate(path) {
  const response = await page.goto(base + path);
  assert.equal(response.status(), 200, path);
  await page.locator('.app-shell').waitFor();
  await page.locator('main').waitFor();
}
async function checkDefaultTitleDictation(editor, title) {
  const field = editor.getByRole('textbox', { name: 'Título', exact: true });
  await field.waitFor();
  assert.equal(await editor.getByRole('textbox', { name: 'Nombre', exact: true }).count(), 0);
  const button = editor.getByRole('button', { name: 'Dictar texto', exact: true });
  assert.equal(await button.isEnabled(), true, 'Dictation must be available before selecting a field');
  assert.equal(await editor.getByRole('button', { name: 'Detener dictado', exact: true }).count(), 0);
  assert.equal(await page.evaluate(() => window.qaDictationStarts), 0, 'Opening a form must not start recording');
  await button.click();
  await page.evaluate(text => window.qaDictation.onresult({ resultIndex: 0, results: [[{ transcript: text }]] }), title);
  await editor.getByRole('button', { name: 'Detener dictado', exact: true }).click();
  assert.ok((await field.inputValue()).includes(title), 'Initial dictation must update Title');
  await page.evaluate(() => { window.qaDictationStarts = 0; });
}
try {
  await navigate('/experimentacion-mvps/hipotesis-principal');
  await page.getByRole('button', { name: 'Hipótesis QA', exact: true }).waitFor();
  checks.push('Authenticated fixture opens its workspace and selected project');
  for (const path of Object.values(sectionPaths)) { await navigate(path); checks.push(`Direct route ${path}`); }
  await navigate('/goi-tree/experimentos');
  assert.equal(await page.getByRole('columnheader', { name: 'Responsable', exact: true }).count(), 0);
  assert.ok(!(await page.getByRole('textbox', { name: 'Buscar experimentos', exact: true }).getAttribute('placeholder')).includes('responsable'));
  assert.equal(await page.locator('.record-owner').count(), 0);
  await navigate('/experimentacion-mvps/hipotesis-principal');
  await page.getByRole('button', { name: 'Editar Hipótesis QA', exact: true }).click();
  const hypothesisEditor = page.locator('dialog.edit-dialog[open]');
  await checkDefaultTitleDictation(hypothesisEditor, 'Título dictado de hipótesis');
  await hypothesisEditor.getByRole('textbox', { name: 'Título', exact: true }).fill('Hipótesis QA');
  assert.equal(await hypothesisEditor.getByRole('combobox', { name: 'Responsable', exact: true }).count(), 0);
  await hypothesisEditor.locator('textarea').first().fill('Hipótesis revisada sin reasignación');
  await hypothesisEditor.getByRole('button', { name: 'Guardar ficha', exact: true }).click();
  await hypothesisEditor.waitFor({ state: 'hidden' });
  assert.equal(records.find(r => r.kind === 'hypothesis').owner_id, user.id);
  assert.equal(writes, 1);
  await navigate('/experimentacion-mvps/experimentos');
  await page.getByRole('button', { name: 'Editar Experimento QA', exact: true }).click();
  const assignedEditor = page.locator('dialog.edit-dialog[open]');
  await checkDefaultTitleDictation(assignedEditor, 'Título dictado de experimento');
  await assignedEditor.getByRole('textbox', { name: 'Título', exact: true }).fill('Experimento QA');
  assert.equal(await assignedEditor.getByRole('combobox', { name: 'Responsable', exact: true }).count(), 0);
  await assignedEditor.getByRole('textbox', { name: 'Contexto', exact: true }).fill('Contexto revisado sin reasignación');
  await assignedEditor.getByRole('button', { name: 'Guardar ficha', exact: true }).click();
  await assignedEditor.waitFor({ state: 'hidden' });
  assert.equal(records.find(r => r.title === 'Experimento QA').owner_id, user.id);
  assert.equal(records.find(r => r.title === 'Experimento QA').fields.hypothesis, 'Hipótesis propia');
  assert.equal(writes, 2);
  checks.push('Assignment is absent from lists/forms and editing preserves existing experiment/hypothesis owners');
  await navigate('/experimentacion-mvps/experimentos');
  assert.equal(await page.getByRole('button', { name: 'Solo otro proyecto', exact: true }).count(), 0);
  await page.getByRole('button', { name: 'Desplegar padres (2)', exact: true }).click();
  await page.getByRole('button', { name: 'Hipótesis QA', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Problema QA', exact: true }).waitFor();
  checks.push('Experiment ancestors expand with project-scoped shared IDs');
  await page.getByRole('button', { name: 'Añadir experimento', exact: true }).first().click();
  const editor = page.locator('dialog.edit-dialog[open]');
  await checkDefaultTitleDictation(editor, 'Experimento nuevo QA');
  assert.equal(await editor.getByRole('combobox', { name: 'Responsable', exact: true }).count(), 0);
  const firstSections = await editor.locator('.form-body').evaluate(body => Array.from(body.children).filter(element => element.matches('label, .experiment-form-ice')).slice(0,3).map(element => element.textContent.trim()));
  assert.equal(firstSections[0], 'Título');
  assert.ok(firstSections[1].startsWith('ICE'));
  assert.ok(firstSections[2].startsWith('Hipótesis padre'));
  assert.equal(await editor.getByRole('heading', { name: 'ICE', exact: true }).count(), 1);
  for (const name of ['Hipótesis', 'Fecha de inicio', 'Fecha de finalización', 'Métricas secundarias', 'Audiencia y asignación de tráfico', 'Riesgos', 'Resultados obtenidos', 'Aprendizaje', 'Decisión', 'Etiquetas (separadas por comas)']) {
    assert.equal(await editor.getByLabel(name, { exact: true }).count(), 0, `Hidden field still shown: ${name}`);
  }
  assert.equal(await editor.getByRole('combobox', { name: 'Hipótesis padre', exact: true }).count(), 1);
  for (const name of ['Contexto', 'Descripción', 'Target', 'Métrica principal', 'Criterio de éxito']) await editor.getByRole('textbox', { name, exact: true }).waitFor();
  const channelSelect = editor.getByRole('combobox', { name: 'Canal principal', exact: true });
  for (const channel of ['meta_ads', 'google_ads', 'smartlead', 'metricool', 'google_play', 'posthog']) {
    await channelSelect.selectOption(channel);
    assert.equal(await editor.locator('summary').filter({ hasText: /^Configuración de / }).count(), 0, `Advanced form shown for ${channel}`);
    await editor.getByText('Preparar con IA', { exact: true }).waitFor();
  }
  await channelSelect.selectOption('');
  checks.push('Experiment editor has only the requested fields, with ICE immediately after Title');
  await editor.getByRole('textbox', { name: 'Título', exact: true }).fill('Experimento nuevo QA');
  await editor.getByRole('textbox', { name: 'Contexto', exact: true }).fill('Contexto escrito por una persona');
  await editor.getByRole('textbox', { name: 'Descripción', exact: true }).fill('Descripción de la prueba');
  await editor.getByRole('textbox', { name: 'Target', exact: true }).fill('Personas de prueba');
  await editor.getByRole('textbox', { name: 'Métrica principal', exact: true }).fill('Clics');
  await editor.evaluate(dialog => { dialog.scrollTop = 0; });
  await editor.screenshot({ path: fileURLToPath(new URL('simplified-experiment-form.png', output)) });
  await editor.getByRole('textbox', { name: 'Contexto', exact: true }).click();
  await editor.getByRole('button', { name: 'Dictar texto', exact: true }).click();
  await page.evaluate(() => window.qaDictation.onresult({ resultIndex: 0, results: [[{ transcript: 'contenido dictado' }]] }));
  await editor.getByRole('button', { name: 'Detener dictado', exact: true }).click();
  await editor.getByRole('textbox', { name: 'Métrica principal', exact: true }).click();
  assert.match(await editor.getByRole('textbox', { name: 'Contexto', exact: true }).inputValue(), /contenido dictado/);
  checks.push('Editor dictation updates the selected React field without microphone access');
  await editor.getByRole('button', { name: 'Guardar ficha', exact: true }).click();
  await editor.waitFor({ state: 'hidden' });
  assert.ok(records.some(r => r.title === 'Experimento nuevo QA' && r.fields.context.includes('Contexto escrito por una persona') && r.fields.context.includes('contenido dictado')));
  checks.push('Create experiment saves typed fields through the existing RPC');
  const detail = page.locator('dialog.detail-dialog[open]');
  await detail.getByRole('button', { name: 'Editar ficha', exact: true }).click();
  await editor.getByRole('spinbutton', { name: 'Impacto (1–10)', exact: true }).fill('8');
  await editor.getByRole('button', { name: 'Guardar ficha', exact: true }).click();
  await editor.waitFor({ state: 'hidden' });
  const edited = records.find(r => r.title === 'Experimento nuevo QA');
  assert.equal(Number(edited.fields.impact), 8);
  assert.match(edited.fields.context, /contenido dictado/);
  assert.equal(edited.parent_id, '66666666-6666-4666-8666-666666666666');
  checks.push('Editing ICE preserves experiment content and its shared hypothesis parent');
  await detail.getByRole('button', { name: 'Documentar aprendizaje', exact: true }).click();
  await page.evaluate(() => { window.qaDictationStarts = 0; });
  await checkDefaultTitleDictation(editor, 'Aprendizaje nuevo QA');
  assert.equal(await editor.getByRole('combobox', { name: 'Responsable', exact: true }).count(), 0);
  await editor.getByRole('textbox', { name: 'Título', exact: true }).fill('Aprendizaje nuevo QA');
  await editor.getByRole('textbox', { name: 'Qué aprendimos', exact: true }).fill('Conclusión pendiente de revisión');
  await editor.getByRole('button', { name: 'Guardar ficha', exact: true }).click();
  await editor.waitFor({ state: 'hidden' });
  assert.ok(records.some(r => r.kind === 'learning' && r.title === 'Aprendizaje nuevo QA' && r.parent_id === edited.id));
  checks.push('Documenting a learning preserves its experiment association');
  await navigate('/experimentacion-mvps/investigacion');
  await page.getByRole('button', { name: 'Añadir investigación', exact: true }).first().click();
  await checkDefaultTitleDictation(editor, 'Investigación nueva QA');
  assert.equal(await editor.getByRole('combobox', { name: 'Responsable', exact: true }).count(), 0);
  await editor.getByRole('textbox', { name: 'Título', exact: true }).fill('Investigación nueva QA');
  await editor.getByRole('textbox', { name: 'Hallazgos', exact: true }).fill('Hallazgo de entrevista');
  const links = editor.getByRole('group', { name: 'Vincular a problemas e hipótesis (puedes elegir varios)', exact: true });
  await links.getByRole('checkbox', { name: 'Problema principal: Problema QA', exact: true }).check();
  await links.getByRole('checkbox', { name: 'Hipótesis principal: Hipótesis QA', exact: true }).check();
  assert.equal(await links.getByText('Problema privado de otro proyecto', { exact: false }).count(), 0);
  await editor.screenshot({ path: fileURLToPath(new URL('research-principal-links.png', output)) });
  await editor.getByRole('button', { name: 'Guardar ficha', exact: true }).click();
  await editor.waitFor({ state: 'hidden' });
  assert.ok(records.some(r => r.title === 'Investigación nueva QA' && r.fields.findings === 'Hallazgo de entrevista'));
  assert.deepEqual(records.find(r => r.title === 'Investigación nueva QA').fields.mvp_links.split(',').sort(), ['55555555-5555-4555-8555-555555555555', '66666666-6666-4666-8666-666666666666']);
  checks.push('Principal problem and hypothesis labels retain multiple links and exclude other projects');
  checks.push('Create research saves findings without cloning a hypothesis or experiment');
  await page.locator('dialog.detail-dialog[open]').getByRole('button', { name: 'Editar ficha', exact: true }).click();
  await checkDefaultTitleDictation(editor, 'Texto de prueba');
  assert.equal(await links.getByRole('checkbox', { name: 'Problema principal: Problema QA', exact: true }).isChecked(), true);
  assert.equal(await links.getByRole('checkbox', { name: 'Hipótesis principal: Hipótesis QA', exact: true }).isChecked(), true);
  await editor.getByRole('button', { name: 'Dictar texto', exact: true }).click();
  await page.evaluate(() => { window.qaStaleDictation = window.qaDictation; window.qaStaleCallback = window.qaDictation.onresult; });
  await editor.getByRole('button', { name: 'Cerrar formulario', exact: true }).click();
  await editor.waitFor({ state: 'hidden' });
  assert.deepEqual(await page.evaluate(() => ({ stopped: window.qaStaleDictation.stopped, onresult: window.qaStaleDictation.onresult, onend: window.qaStaleDictation.onend, onerror: window.qaStaleDictation.onerror })), { stopped: true, onresult: null, onend: null, onerror: null });
  await page.getByRole('button', { name: 'Investigación nueva QA', exact: true }).click();
  await page.locator('dialog.detail-dialog[open]').getByRole('button', { name: 'Editar ficha', exact: true }).click();
  await page.evaluate(() => window.qaStaleCallback({ resultIndex: 0, results: [[{ transcript: 'No debe escribirse' }]] }));
  assert.equal(await editor.getByRole('textbox', { name: 'Título', exact: true }).inputValue(), 'Investigación nueva QA');
  await editor.getByRole('button', { name: 'Cerrar formulario', exact: true }).click();
  checks.push('Title dictation works on create/edit and closing a form stops recording and ignores late results');
  for (const path of ['/proyectos', '/goi-tree/objetivos', '/goi-tree/oportunidades']) {
    await navigate(path);
    await page.getByRole('button', { name: 'Crear', exact: true }).click();
    await checkDefaultTitleDictation(editor, 'Título dictado de prueba');
    await editor.getByRole('button', { name: 'Cerrar formulario', exact: true }).click();
    checks.push(`Default Title dictation in ${path}`);
  }
  async function dropFile(section, name) {
    const transfer = await page.evaluateHandle(({ bytes, name }) => {
      const data = new DataTransfer(); data.items.add(new File([Uint8Array.from(bytes)], name, { type: 'image/png' })); return data;
    }, { bytes: [...pixel], name });
    const zone = section.getByRole('button', { name: 'Subir archivos', exact: true });
    await page.waitForFunction(element => !element.disabled, await zone.elementHandle());
    await zone.dispatchEvent('dragenter', { dataTransfer: transfer });
    await page.waitForFunction(element => element.classList.contains('is-dragging'), await zone.elementHandle());
    assert.ok((await zone.getAttribute('class')).includes('is-dragging'));
    await zone.dispatchEvent('drop', { dataTransfer: transfer });
    await transfer.dispose();
  }
  const filePanel = editor.getByRole('region', { name: 'Archivos de la ficha', exact: true });
  const chooseFile = async name => filePanel.getByLabel('Seleccionar archivos para la ficha', { exact: true }).setInputFiles({ name, mimeType: 'image/png', buffer: pixel });
  const createResearch = async title => {
    await navigate('/experimentacion-mvps/investigacion');
    await page.getByRole('button', { name: 'Añadir investigación', exact: true }).first().click();
    await editor.getByRole('textbox', { name: 'Título', exact: true }).fill(title);
  };
  await createResearch('Selección cancelada');
  const beforeCancelWrites = writes;
  const fileChooser = page.waitForEvent('filechooser');
  await filePanel.getByRole('button', { name: 'Subir archivos', exact: true }).click();
  await (await fileChooser).setFiles({ name: 'cancelada.png', mimeType: 'image/png', buffer: pixel });
  await dropFile(filePanel, 'cancelada-arrastrada.png');
  assert.equal(await filePanel.locator('.attachment-pending').count(), 2);
  await filePanel.getByLabel('Seleccionar archivos para la ficha', { exact: true }).setInputFiles({ name: 'rechazado.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg/>') });
  await filePanel.getByRole('alert').filter({ hasText: 'Adjunta una imagen' }).waitFor();
  assert.equal(await filePanel.locator('.attachment-pending').count(), 2);
  await filePanel.getByRole('button', { name: 'Retirar cancelada.png', exact: true }).click();
  assert.equal(await filePanel.locator('.attachment-pending').count(), 1);
  assert.equal(uploads.length, 0); assert.equal(attachments.length, 0); assert.equal(writes, beforeCancelWrites);
  await filePanel.locator('.attachment-image img').first().evaluate(image => image.complete ? null : new Promise(resolve => { image.onload = resolve; image.onerror = resolve; }));
  assert.ok(await filePanel.locator('.attachment-image img').first().evaluate(image => image.naturalWidth > 0));
  await editor.getByRole('button', { name: 'Cerrar formulario', exact: true }).click();
  await createResearch('Archivos con reintento');
  assert.equal(await filePanel.locator('.attachment-pending').count(), 0);
  checks.push('Device selection and file drop preview unsaved files, without writes, and cancellation clears the next record');
  await chooseFile('primera.png'); await dropFile(filePanel, 'reintento.png');
  failUpload = 'reintento.png';
  await editor.getByRole('button', { name: 'Guardar ficha', exact: true }).click();
  await editor.getByRole('alert').filter({ hasText: 'La ficha se guardó, pero faltan archivos' }).waitFor();
  assert.equal(await filePanel.locator('.attachment-pending').count(), 1);
  assert.equal(records.filter(record => record.title === 'Archivos con reintento').length, 1);
  assert.equal(attachments.filter(item => item.name === 'primera.png').length, 1);
  await editor.getByRole('button', { name: 'Guardar ficha', exact: true }).click();
  await editor.waitFor({ state: 'hidden' });
  assert.equal(uploads.filter(name => name === 'primera.png').length, 1);
  assert.equal(uploads.filter(name => name === 'reintento.png').length, 2);
  const researchWithFiles = records.find(record => record.title === 'Archivos con reintento');
  assert.equal(attachments.filter(item => item.record_id === researchWithFiles.id).length, 2);
  checks.push('Research uploads after creation and partial failure retries only remaining files without duplicate records or uploads');
  await page.locator('dialog.detail-dialog[open]').getByRole('button', { name: 'Editar ficha', exact: true }).click();
  await dropFile(filePanel, 'edicion.png');
  await filePanel.getByRole('button', { name: 'Retirar edicion.png', exact: true }).waitFor();
  assert.equal(attachments.filter(item => item.record_id === researchWithFiles.id).length, 3);
  await editor.getByRole('button', { name: 'Cerrar formulario', exact: true }).click();
  checks.push('Editing an existing record accepts a direct file drop using the same private upload flow');
  await navigate('/experimentacion-mvps/hipotesis');
  await page.getByRole('button', { name: 'Añadir hipótesis', exact: true }).first().click();
  await editor.getByRole('textbox', { name: 'Título', exact: true }).fill('Hipótesis con imagen');
  await chooseFile('hipotesis.png');
  await editor.getByRole('button', { name: 'Guardar ficha', exact: true }).click();
  await editor.waitFor({ state: 'hidden' });
  assert.ok(attachments.some(item => item.name === 'hipotesis.png' && records.find(record => record.id === item.record_id)?.kind === 'hypothesis'));
  checks.push('New hypotheses save their staged images along with the record');
  await navigate('/experimentacion-mvps/experimentos');
  await page.getByRole('button', { name: 'Añadir experimento', exact: true }).first().click();
  await editor.getByRole('textbox', { name: 'Título', exact: true }).fill('Experimento con adjuntos compartidos');
  await editor.getByRole('combobox', { name: 'Canal principal', exact: true }).selectOption('meta_ads');
  await chooseFile('compartida.png');
  await editor.locator('.ai-file-list').getByText('compartida.png', { exact: true }).waitFor();
  await editor.locator('.ai-file-list').getByRole('button', { name: 'Quitar compartida.png', exact: true }).click();
  assert.equal(await filePanel.locator('.attachment-pending').count(), 0);
  await chooseFile('compartida.png');
  await editor.getByRole('button', { name: 'Guardar ficha', exact: true }).click();
  await editor.waitFor({ state: 'hidden' });
  assert.equal(uploads.filter(name => name === 'compartida.png').length, 1);
  checks.push('Experiment attachments and AI materials share one selection and are saved only once');
  for (const [path, name] of [
    ['/experimentacion-mvps/hipotesis', 'Añadir hipótesis'],
    ['/experimentacion-mvps/experimentos', 'Añadir experimento'],
    ['/experimentacion-mvps/investigacion', 'Añadir investigación'],
    ['/goi-tree/objetivos', 'Crear'],
    ['/goi-tree/input-metrics', 'Crear'],
    ['/aprendizajes', 'Crear'],
    ['/proyectos', 'Crear'],
  ]) {
    await navigate(path);
    const button = page.getByRole('button', { name, exact: true }).first();
    assert.ok((await button.boundingBox()).height >= 52, `Larger creation target in ${path}`);
    assert.ok(parseFloat(await button.evaluate(element => getComputedStyle(element).fontSize)) >= 15);
    assert.equal(await button.locator('svg').count(), 1);
    assert.equal(await button.locator('svg').innerHTML(), await page.locator('h1.minimal-section-title svg').innerHTML());
    assert.equal(await button.evaluate(element => getComputedStyle(element).color), await page.locator('h1.minimal-section-title').evaluate(element => getComputedStyle(element).color));
  }
  checks.push('Creation controls are substantially larger and match every section color and icon');
  await navigate('/ia');
  const library = page.locator('details.methodology-library');
  assert.equal(await library.locator('.methodology-cover-preview img').count(), 3);
  assert.equal(await library.locator('.methodology-library-copy > span').count(), 2);
  assert.ok((await library.innerText()).includes('o guiar investigaciones'));
  assert.ok((await library.innerText()).includes('Importa información y contexto relevante de tus proyectos'));
  const coversRect = await library.locator('.methodology-cover-preview').boundingBox();
  const libraryLink = library.getByText('Ver libros', { exact: true });
  const linkRect = await libraryLink.boundingBox();
  assert.ok(linkRect.y >= coversRect.y + coversRect.height);
  await libraryLink.click();
  assert.equal(await library.evaluate(element => element.open), true);
  assert.equal(await library.getByRole('link', { name: /Comprar .* en Amazon/ }).count(), 3);
  await libraryLink.click();
  assert.equal(await library.evaluate(element => element.open), false);
  await library.screenshot({ path: fileURLToPath(new URL('methodology-library-link.png', output)) });
  checks.push('The library preserves three covers, uses the requested copy, and Ver libros expands the Amazon links');
  await navigate('/proyectos');
  assert.equal(await page.locator('.experimental-book-banner').count(), 0);
  await page.screenshot({ path: fileURLToPath(new URL('large-create-actions.png', output)), fullPage: true });
  await page.getByRole('button', { name: 'Crear', exact: true }).click();
  await editor.getByRole('textbox', { name: 'Título', exact: true }).fill('Proyecto con archivos');
  await chooseFile('proyecto.png');
  await editor.getByRole('button', { name: 'Guardar ficha', exact: true }).click();
  await editor.waitFor({ state: 'hidden' });
  assert.ok(attachments.some(item => item.name === 'proyecto.png' && records.find(record => record.id === item.record_id)?.kind === 'project'));
  checks.push('Projects also save their files from the initial creation form');
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/proyectos', '/experimentacion-mvps/hipotesis', '/experimentacion-mvps/experimentos', '/goi-tree', '/ia', '/integraciones']) {
    await navigate(path);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `Mobile page overflows: ${path}`);
    checks.push(`Mobile viewport fits ${path} at 390px`);
  }
  const publicContext = await browser.newContext();
  await publicContext.route('**/*', fixtureRoute);
  const reader = await publicContext.newPage();
  await reader.goto(base + '/goi-tree/experimentos');
  await reader.locator('.app-shell').waitFor();
  assert.equal(await reader.getByRole('button', { name: 'Crear', exact: true }).count(), 0);
  assert.equal(await reader.getByRole('button', { name: 'Editar ficha', exact: true }).count(), 0);
  await reader.getByRole('button', { name: 'Integraciones', exact: true }).click();
  await reader.locator('main > .panel').getByRole('button', { name: 'Crear mi espacio gratis', exact: true }).waitFor();
  assert.equal(await reader.getByRole('button', { name: 'Comprobar conexión', exact: true }).count(), 0);
  checks.push('Public reader cannot create/edit records or configure integration credentials');
  await publicContext.close();
  assert.deepEqual(errors, [], 'Uncaught browser errors');
  assert.deepEqual([...new Set(unexpected)], [], 'Unexpected external destination');
  await page.screenshot({ path: fileURLToPath(new URL('browser-local.png', output)), fullPage: true });
  console.log(JSON.stringify({ passed: checks.length, checks, fixtureWrites: writes, productionWrites: 0, browserErrors: errors }));
} catch (error) {
  await writeFile(new URL('failure-ui.txt', output), await page.locator('body').innerText());
  await writeFile(new URL('failure-overflow.json', output), JSON.stringify(await page.evaluate(() => ({ width: window.innerWidth, documentWidth: document.documentElement.scrollWidth, elements: [...document.querySelectorAll('body *')].filter(el => el.getBoundingClientRect().right > window.innerWidth + 1).map(el => ({ tag: el.tagName, className: String(el.className), width: el.getBoundingClientRect().width, right: el.getBoundingClientRect().right })).slice(0,20) })), null, 2));
  await page.screenshot({ path: fileURLToPath(new URL('failure.png', output)), fullPage: true });
  throw error;
} finally {
  await writeFile(new URL('browser-report.json', output), JSON.stringify({ checks, fixtureWrites: writes, productionWrites: 0, errors, unexpected }, null, 2));
  await browser.close();
}
