import { ArrowUpRight } from "lucide-react";

export function EnglishMethodGuide() {
  return <div className="method-content">
    <section className="panel">
      <h2>1. Start with a project</h2>
      <p>In <strong>Projects</strong>, create a space for each product or initiative. Choose one to work with two connected trees: <strong>MVPs Tree</strong> for researching and validating business ideas, and <strong>Growth Tree</strong> for organizing goals, opportunities, and growth. Both use the same project, team, and information.</p>
    </section>
    <section className="panel">
      <h2>2. Discover and validate with MVPs Tree</h2>
      <div className="method-chain method-chain-mvp">
        {["Problems or Opportunities", "Hypotheses", "Experiments or Research"].map((label, index) =>
          <span key={label}><small>0{index + 1}</small>{label}</span>)}
      </div>
      <p><strong>First, identify customer problems or opportunities.</strong> Create a record for each one and attach your evidence. Then add hypotheses that try to explain or solve each problem.</p>
      <p><strong>Test hypotheses in two ways:</strong> through <strong>Research</strong> (interviews, surveys, observation, or desk research) to gather qualitative findings, or through <strong>Experiments</strong> to test a solution or proposition and measure results. One hypothesis can be linked to several studies and experiments.</p>
      <p>The tree expands child records by default. Collapse or expand branches using <strong>Show children / Hide children</strong>. Records without a parent appear under <strong>Unlinked</strong>, ready to be linked later.</p>
      <a href="/experimentacion-mvps">Open MVPs Tree <ArrowUpRight size={14}/></a>
    </section>
    <section className="panel">
      <h2>3. Organize growth with Growth Tree</h2>
      <div className="method-chain">
        {["North Star", "Goals + Input Metrics", "Opportunities and problems", "Hypotheses", "Experiments"].map((label, index) =>
          <span key={label}><small>0{index + 1}</small>{label}</span>)}
      </div>
      <p>Define the project's <strong>North Star Metric</strong>. <strong>Goals</strong> and <strong>Input Metrics</strong> sit directly beneath it. Each can contain problems or opportunities, which lead to <strong>Hypotheses</strong> that you can validate with <strong>Experiments</strong>.</p>
      <p className="method-shared-trees"><strong>How the trees connect:</strong> problems, opportunities, hypotheses, and experiments use shared records across MVPs Tree and Growth Tree. Creating, editing, or deleting one updates both views, subject to permissions. Comments, attachments, and relationships are shared rather than duplicated.</p>
      <a href="/goi-tree">Open Growth Tree <ArrowUpRight size={14}/></a>
    </section>
    <section className="panel">
      <h2>4. Research and ask your project's AI</h2>
      <p>In <strong>AI</strong>, ask about customer problems, hypotheses, and next steps. Under <strong>Project memory → Import information</strong>, add research, interviews, metrics, and dated sources. The AI uses available context; verify its conclusions before acting.</p>
      <p>Dictate questions or attach documents to the chat. AI features require a signed-in team account and an OpenAI connection set up by an administrator in Integrations. You can also save research as records in MVPs Tree and link them to hypotheses.</p>
      <a href="/guia-investigacion" target="_blank" rel="noopener noreferrer">Guide to researching a market from scratch <ArrowUpRight size={14}/></a>
    </section>
    <section className="panel">
      <h2>5. Design a testable experiment</h2>
      <p>Before testing, define your <strong>hypothesis, primary metric or evidence, success criterion, and audience</strong>. Where relevant, specify traffic allocation and use ICE (impact, confidence, ease) for prioritization. Qualitative studies can be documented as Research in MVPs Tree.</p>
      <p>Experiments are shared between both trees and can be connected to the same hypothesis. Documenting an experiment does not automatically run it: implementation must happen in your product or experimentation tool.</p>
    </section>
    <section className="panel">
      <h2>6. Save and reuse learnings</h2>
      <p>After every test, use <strong>Document learning</strong> to capture results, evidence, limitations, and the next decision—even when the hypothesis is not supported. Shared records retain comments, files, and change history across both trees.</p>
      <p><strong>Sharing:</strong> published information can be viewed without an account in read-only mode. Creating or editing requires an account and permissions. Workspace members with access can export their data.</p>
    </section>
  </div>;
}
