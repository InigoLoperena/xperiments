import assert from "node:assert/strict";
import test from "node:test";
import { translateUI } from "../app/language-controller";
import { englishInterfaceCopy } from "../app/language-dictionary";
import { englishWorkspaceCopy } from "../app/workspace-translations";

test("English interface covers landing and primary workspace navigation", () => {
  for (const key of ["Deja de decidir por intuición.", "Preguntas frecuentes", "Probar gratis, sin tarjeta"]) {
    assert.notEqual(translateUI(key, "en"), key, key);
  }
  for (const key of ["Proyectos", "Problema principal", "Hipótesis", "Experimentos", "Equipo", "Integraciones", "Cómo utilizar Xperiments"]) {
    assert.notEqual(translateUI(key, "en"), key, key);
  }
});

test("Spanish source remains unchanged, including whitespace and record-like strings", () => {
  assert.equal(translateUI("  Hipótesis  ", "en"), "  Hypotheses  ");
  assert.equal(translateUI("  Hipótesis  ", "es"), "  Hipótesis  ");
  assert.equal(translateUI("My user-created project", "en"), "My user-created project");
  assert.equal(translateUI("Desconocido", "en"), "Desconocido");
});

test("Translation dictionaries cover both public site and application", () => {
  assert.ok(Object.keys(englishInterfaceCopy).length >= 130);
  assert.ok(Object.keys(englishWorkspaceCopy).length >= 400);
  assert.equal(translateUI("Seleccionar idioma", "en"), "Choose language");
});
