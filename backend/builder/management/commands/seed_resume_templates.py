from django.core.management.base import BaseCommand
from builder.models import ResumeBuildTemplate


TEMPLATES_DATA = [
    {
        "id": 1,
        "name": "Classic Centered",
        "html_content": """<div class="resume resume--classic-centered">
  <header class="resume__header">
    <h1 class="resume__name">{{name}}</h1>
    {{#if title}}<div class="resume__job-title-line">{{title}}</div>{{/if}}
    <div class="resume__contact">
      {{#if location}}<span>{{location}}</span>{{/if}}
      {{#if phone}}<span class="dot">&#9670;</span><span>{{phone}}</span>{{/if}}
      {{#if email}}<span class="dot">&#9670;</span><span>{{email}}</span>{{/if}}
      {{#if linkedin}}<span class="dot">&#9670;</span><a class="resume__contact-link" href="https://{{linkedin}}" target="_blank" rel="noopener noreferrer">{{linkedin}}</a>{{/if}}
      {{#if website}}<span class="dot">&#9670;</span><a class="resume__contact-link" href="https://{{website}}" target="_blank" rel="noopener noreferrer">{{website}}</a>{{/if}}
    </div>
  </header>

  {{#if summary}}
  <section class="resume__section">
    <h2 class="resume__section-title"><span>Summary</span></h2>
    <p class="resume__summary">{{summary}}</p>
  </section>
  {{/if}}

  {{#if skills.length}}
  <section class="resume__section">
    <h2 class="resume__section-title"><span>Skills</span></h2>
    <ul class="resume__two-col">
      {{#each skills}}
      <li>{{this}}</li>
      {{/each}}
    </ul>
  </section>
  {{/if}}

  {{#if experience.length}}
  <section class="resume__section">
    <h2 class="resume__section-title"><span>Experience</span></h2>
    {{#each experience}}
    <div class="resume__job">
      <div class="resume-entry-top">
        <p class="resume__job-title"><strong>{{role}}</strong> &mdash; <em>{{company}}</em></p>
        <span class="resume__job-date">{{duration}}</span>
      </div>
      {{#if location}}<p class="resume__job-sub">{{location}}</p>{{/if}}
      {{#if description}}<p class="resume-entry-desc">{{description}}</p>{{/if}}
    </div>
    {{/each}}
  </section>
  {{/if}}

  {{#if education.length}}
  <section class="resume__section">
    <h2 class="resume__section-title"><span>Education</span></h2>
    {{#each education}}
    <div class="resume__edu-item">
      <div class="resume-entry-top">
        <p class="resume__degree"><strong>{{degree}}</strong> &mdash; {{school}}</p>
        <span class="resume__job-date">{{duration}}</span>
      </div>
      {{#if location}}<p class="resume__job-sub">{{location}}</p>{{/if}}
    </div>
    {{/each}}
  </section>
  {{/if}}

  {{#if projects.length}}
  <section class="resume__section">
    <h2 class="resume__section-title"><span>Projects</span></h2>
    {{#each projects}}
    <div class="resume__job">
      <div class="resume-entry-top">
        <p class="resume__job-title"><strong>{{name}}</strong></p>
        {{#if link}}<a class="resume-entry-date" href="{{link}}" target="_blank" rel="noopener noreferrer">{{link}}</a>{{/if}}
      </div>
      {{#if technologies}}<p class="resume-project-tech"><strong>Technologies:</strong> {{technologies}}</p>{{/if}}
      {{#if description}}<p class="resume-entry-desc">{{description}}</p>{{/if}}
    </div>
    {{/each}}
  </section>
  {{/if}}

  {{#if certifications.length}}
  <section class="resume__section">
    <h2 class="resume__section-title"><span>Certifications</span></h2>
    {{#each certifications}}
    <div class="resume__job">
      <div class="resume-entry-top">
        <p class="resume__job-title"><strong>{{name}}</strong>{{#if issuer}} &mdash; {{issuer}}{{/if}}</p>
        {{#if date}}<span class="resume__job-date">{{date}}</span>{{/if}}
      </div>
    </div>
    {{/each}}
  </section>
  {{/if}}
</div>""",
        "css_content": """.resume--classic-centered {
  font-family: 'Georgia', 'Times New Roman', serif;
  color: #1a1a1a;
  width: 794px;
  height: 1123px;
  max-height: 1123px;
  margin: 0 auto;
  padding: 28px 38px;
  background: #ffffff;
  line-height: 1.4;
  box-sizing: border-box;
  overflow: hidden;
}

.resume--classic-centered .resume__header {
  text-align: center;
  border-bottom: 2px double #16205c;
  padding-bottom: 8px;
  margin-bottom: 12px;
}

.resume--classic-centered .resume__name {
  font-size: 22px;
  letter-spacing: 1.5px;
  color: #16205c;
  margin: 0 0 3px 0;
  font-weight: 700;
  text-transform: uppercase;
}

.resume--classic-centered .resume__job-title-line {
  font-size: 12px;
  color: #444;
  font-style: italic;
  margin-bottom: 4px;
}

.resume--classic-centered .resume__contact {
  font-size: 11px;
  color: #333333;
  line-height: 1.5;
}

.resume--classic-centered .resume__contact .dot {
  color: #16205c;
  margin: 0 5px;
  font-size: 7px;
  vertical-align: middle;
}

.resume--classic-centered .resume__contact-link {
  color: #16205c;
  text-decoration: underline;
  text-underline-offset: 1px;
}

.resume--classic-centered .resume__section {
  margin-bottom: 10px;
}

.resume--classic-centered .resume__section-title {
  display: flex;
  align-items: center;
  text-align: center;
  color: #16205c;
  font-size: 11.5px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-weight: 700;
  margin: 0 0 6px 0;
}

.resume--classic-centered .resume__section-title::before,
.resume--classic-centered .resume__section-title::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #16205c;
  margin: 0 8px;
}

.resume--classic-centered .resume__summary {
  font-size: 11.5px;
  color: #2b2b2b;
  line-height: 1.45;
  margin: 0;
}

.resume--classic-centered .resume__two-col {
  list-style: disc;
  columns: 2;
  column-gap: 20px;
  padding-left: 18px;
  margin: 0;
  font-size: 11.5px;
}

.resume--classic-centered .resume__two-col li {
  margin-bottom: 3px;
  color: #16205c;
}

.resume--classic-centered .resume-entry-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.resume--classic-centered .resume__job,
.resume--classic-centered .resume__edu-item {
  margin-bottom: 7px;
  font-size: 11.5px;
  break-inside: avoid;
}

.resume--classic-centered .resume__job-title,
.resume--classic-centered .resume__degree {
  margin: 0;
  font-size: 12px;
  color: #111;
}

.resume--classic-centered .resume__job-sub {
  margin: 1px 0 0 0;
  font-size: 11px;
  color: #555;
}

.resume--classic-centered .resume__job-date {
  font-size: 11px;
  color: #666;
  font-family: monospace;
  white-space: nowrap;
}

.resume--classic-centered .resume-entry-desc {
  font-size: 11px;
  color: #333;
  margin-top: 2px;
  line-height: 1.4;
  white-space: pre-line;
}

.resume--classic-centered .resume-project-tech {
  font-size: 10.5px;
  color: #555;
  margin-top: 2px;
}

.resume--classic-centered .resume-entry-date {
  font-size: 11px;
  color: #16205c;
  text-decoration: underline;
  font-family: monospace;
  white-space: nowrap;
}""",
    },
    {
        "id": 2,
        "name": "Teal Label",
        "html_content": """<div class="resume-doc template-teal-label">
  <div class="tl-header">
    <div>
      <h1><span class="tl-first">{{first_name}}</span> {{last_name}}</h1>
      {{#if title}}<div class="tl-job-title">{{title}}</div>{{/if}}
    </div>
    <div class="tl-contact">
      {{#if email}}<div>{{email}}</div>{{/if}}
      {{#if phone}}<div>{{phone}}</div>{{/if}}
      {{#if location}}<div>{{location}}</div>{{/if}}
      {{#if linkedin}}<div><a class="tl-link" href="https://{{linkedin}}" target="_blank" rel="noopener noreferrer">{{linkedin}}</a></div>{{/if}}
      {{#if website}}<div><a class="tl-link" href="https://{{website}}" target="_blank" rel="noopener noreferrer">{{website}}</a></div>{{/if}}
    </div>
  </div>
  <div class="tl-rule"></div>

  {{#if summary}}
  <div class="tl-row">
    <div class="tl-label">Summary</div>
    <div class="tl-content"><p class="resume-entry-desc">{{summary}}</p></div>
  </div>
  {{/if}}

  {{#if skills.length}}
  <div class="tl-row">
    <div class="tl-label">Skills</div>
    <div class="tl-content">
      <ul class="qual-list">
        {{#each skills}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
  </div>
  {{/if}}

  {{#if experience.length}}
  <div class="tl-row">
    <div class="tl-label">Experience</div>
    <div class="tl-content">
      {{#each experience}}
      <div class="resume-entry">
        <div class="resume-entry-top">
          <div>
            <div class="resume-entry-title">{{role}}</div>
            <div class="resume-entry-sub">{{company}}{{#if location}} &mdash; {{location}}{{/if}}</div>
          </div>
          <div class="resume-entry-date">{{duration}}</div>
        </div>
        {{#if description}}<div class="resume-entry-desc">{{description}}</div>{{/if}}
      </div>
      {{/each}}
    </div>
  </div>
  {{/if}}

  {{#if education.length}}
  <div class="tl-row">
    <div class="tl-label">Education</div>
    <div class="tl-content">
      {{#each education}}
      <div class="resume-entry">
        <div class="resume-entry-top">
          <div>
            <div class="resume-entry-title">{{degree}}</div>
            <div class="resume-entry-sub">{{school}}{{#if location}} &mdash; {{location}}{{/if}}</div>
          </div>
          <div class="resume-entry-date">{{duration}}</div>
        </div>
      </div>
      {{/each}}
    </div>
  </div>
  {{/if}}

  {{#if projects.length}}
  <div class="tl-row">
    <div class="tl-label">Projects</div>
    <div class="tl-content">
      {{#each projects}}
      <div class="resume-entry">
        <div class="resume-entry-top">
          <div class="resume-entry-title">{{name}}</div>
          {{#if link}}<a class="resume-entry-date tl-link" href="{{link}}" target="_blank" rel="noopener noreferrer">{{link}}</a>{{/if}}
        </div>
        {{#if technologies}}<div class="resume-project-tech"><strong>Technologies:</strong> {{technologies}}</div>{{/if}}
        {{#if description}}<div class="resume-entry-desc">{{description}}</div>{{/if}}
      </div>
      {{/each}}
    </div>
  </div>
  {{/if}}

  {{#if certifications.length}}
  <div class="tl-row">
    <div class="tl-label">Certifications</div>
    <div class="tl-content">
      {{#each certifications}}
      <div class="resume-entry">
        <div class="resume-entry-top">
          <div>
            <div class="resume-entry-title">{{name}}</div>
            {{#if issuer}}<div class="resume-entry-sub">{{issuer}}</div>{{/if}}
          </div>
          {{#if date}}<div class="resume-entry-date">{{date}}</div>{{/if}}
        </div>
      </div>
      {{/each}}
    </div>
  </div>
  {{/if}}
</div>""",
        "css_content": """.template-teal-label {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1a1a1a;
  width: 794px;
  height: 1123px;
  max-height: 1123px;
  margin: 0 auto;
  padding: 28px 38px;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 1.4;
}

.template-teal-label .tl-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.6rem;
}

.template-teal-label .tl-header h1 {
  font-size: 1.55rem;
  font-weight: 700;
  margin: 0 0 2px;
  letter-spacing: -0.01em;
}

.template-teal-label .tl-job-title {
  font-size: 0.8rem;
  color: #0d9488;
  font-weight: 500;
  margin-top: 2px;
}

.template-teal-label .tl-first {
  color: #0d9488;
}

.template-teal-label .tl-contact {
  text-align: right;
  font-size: 0.72rem;
  color: #555;
  line-height: 1.5;
}

.template-teal-label .tl-link {
  color: #0d9488;
  text-decoration: underline;
  text-underline-offset: 1px;
}

.template-teal-label .tl-rule {
  height: 1.5px;
  background: #0d9488;
  margin-bottom: 0.85rem;
}

.template-teal-label .tl-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 1.2rem;
  margin-bottom: 0.8rem;
  break-inside: avoid;
}

.template-teal-label .tl-label {
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #0d9488;
  line-height: 1.4;
  padding-top: 1px;
}

.template-teal-label .qual-list {
  list-style: disc;
  margin: 0;
  padding-left: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.2rem 1rem;
  font-size: 0.78rem;
  color: #333;
}

.template-teal-label .resume-entry {
  margin-bottom: 0.6rem;
  break-inside: avoid;
}

.template-teal-label .resume-entry:last-child {
  margin-bottom: 0;
}

.template-teal-label .resume-entry-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.template-teal-label .resume-entry-title {
  font-weight: 700;
  font-size: 0.85rem;
  color: #111;
}

.template-teal-label .resume-entry-sub {
  font-size: 0.76rem;
  color: #555;
}

.template-teal-label .resume-entry-date {
  font-size: 0.7rem;
  color: #777;
  font-family: monospace;
  white-space: nowrap;
}

.template-teal-label .resume-entry-desc {
  font-size: 0.76rem;
  color: #333;
  line-height: 1.4;
  margin-top: 0.12rem;
  white-space: pre-line;
}

.template-teal-label .resume-project-tech {
  font-size: 0.72rem;
  color: #555;
  margin-top: 0.12rem;
}""",
    },
    {
        "id": 3,
        "name": "Purple Block",
        "html_content": """<div class="resume-doc template-purple-block">
  <div class="pb-topbar"></div>
  <div class="pb-header">
    <h1>{{name}}</h1>
    {{#if title}}<div class="pb-job-title">{{title}}</div>{{/if}}
    <div class="pb-contact">
      {{#if location}}<span>{{location}}</span>{{/if}}
      {{#if phone}}<span> &bull; {{phone}}</span>{{/if}}
      {{#if email}}<span> &bull; {{email}}</span>{{/if}}
      {{#if linkedin}}<span> &bull; </span><a class="pb-link" href="https://{{linkedin}}" target="_blank" rel="noopener noreferrer">{{linkedin}}</a>{{/if}}
      {{#if website}}<span> &bull; </span><a class="pb-link" href="https://{{website}}" target="_blank" rel="noopener noreferrer">{{website}}</a>{{/if}}
    </div>
  </div>
  <div class="pb-rule"></div>

  {{#if summary}}
  <div class="resume-section">
    <div class="resume-section-title">Summary</div>
    <p class="resume-entry-desc">{{summary}}</p>
  </div>
  {{/if}}

  {{#if skills.length}}
  <div class="resume-section">
    <div class="resume-section-title">Skills</div>
    <ul class="qual-list">
      {{#each skills}}
      <li>{{this}}</li>
      {{/each}}
    </ul>
  </div>
  {{/if}}

  {{#if experience.length}}
  <div class="resume-section">
    <div class="resume-section-title">Experience</div>
    {{#each experience}}
    <div class="resume-entry">
      <div class="resume-entry-top">
        <div>
          <div class="resume-entry-title">{{role}}</div>
          <div class="resume-entry-sub">{{company}}{{#if location}} &mdash; {{location}}{{/if}}</div>
        </div>
        <div class="resume-entry-date">{{duration}}</div>
      </div>
      {{#if description}}<div class="resume-entry-desc">{{description}}</div>{{/if}}
    </div>
    {{/each}}
  </div>
  {{/if}}

  {{#if education.length}}
  <div class="resume-section">
    <div class="resume-section-title">Education</div>
    {{#each education}}
    <div class="resume-entry">
      <div class="resume-entry-top">
        <div>
          <div class="resume-entry-title">{{degree}}</div>
          <div class="resume-entry-sub">{{school}}{{#if location}} &mdash; {{location}}{{/if}}</div>
        </div>
        <div class="resume-entry-date">{{duration}}</div>
      </div>
    </div>
    {{/each}}
  </div>
  {{/if}}

  {{#if projects.length}}
  <div class="resume-section">
    <div class="resume-section-title">Projects</div>
    {{#each projects}}
    <div class="resume-entry">
      <div class="resume-entry-top">
        <div class="resume-entry-title">{{name}}</div>
        {{#if link}}<a class="resume-entry-date pb-link" href="{{link}}" target="_blank" rel="noopener noreferrer">{{link}}</a>{{/if}}
      </div>
      {{#if technologies}}<div class="resume-project-tech"><strong>Technologies:</strong> {{technologies}}</div>{{/if}}
      {{#if description}}<div class="resume-entry-desc">{{description}}</div>{{/if}}
    </div>
    {{/each}}
  </div>
  {{/if}}

  {{#if certifications.length}}
  <div class="resume-section">
    <div class="resume-section-title">Certifications</div>
    {{#each certifications}}
    <div class="resume-entry">
      <div class="resume-entry-top">
        <div>
          <div class="resume-entry-title">{{name}}</div>
          {{#if issuer}}<div class="resume-entry-sub">{{issuer}}</div>{{/if}}
        </div>
        {{#if date}}<div class="resume-entry-date">{{date}}</div>{{/if}}
      </div>
    </div>
    {{/each}}
  </div>
  {{/if}}
</div>""",
        "css_content": """.template-purple-block {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1a1a1a;
  width: 794px;
  height: 1123px;
  max-height: 1123px;
  margin: 0 auto;
  padding: 0 38px 28px;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 1.4;
}

.template-purple-block .pb-topbar {
  height: 6px;
  background: #7c3aed;
  margin: 0 -38px 1rem;
}

.template-purple-block .pb-header {
  text-align: center;
  margin-bottom: 0.5rem;
}

.template-purple-block .pb-header h1 {
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #7c3aed;
  text-transform: uppercase;
  margin: 0 0 0.15rem;
}

.template-purple-block .pb-job-title {
  font-size: 0.82rem;
  color: #6d28d9;
  font-style: italic;
  margin-bottom: 0.3rem;
}

.template-purple-block .pb-contact {
  font-size: 0.74rem;
  font-weight: 500;
  color: #444;
}

.template-purple-block .pb-link {
  color: #7c3aed;
  text-decoration: underline;
  text-underline-offset: 1px;
}

.template-purple-block .pb-rule {
  border-top: 1.5px dotted #7c3aed;
  margin-bottom: 0.85rem;
}

.template-purple-block .resume-section {
  margin-bottom: 0.8rem;
  break-inside: avoid;
}

.template-purple-block .resume-section-title {
  font-size: 0.76rem;
  font-weight: 700;
  color: #7c3aed;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px dotted #a78bfa;
  padding-bottom: 0.18rem;
  margin-bottom: 0.4rem;
}

.template-purple-block .qual-list {
  list-style: disc;
  margin: 0;
  padding-left: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.2rem 1rem;
  font-size: 0.78rem;
  color: #333;
}

.template-purple-block .resume-entry {
  margin-bottom: 0.6rem;
}

.template-purple-block .resume-entry-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.template-purple-block .resume-entry-title {
  font-weight: 700;
  font-size: 0.86rem;
  color: #111;
}

.template-purple-block .resume-entry-sub {
  font-size: 0.76rem;
  color: #555;
}

.template-purple-block .resume-entry-date {
  font-size: 0.7rem;
  color: #666;
  font-family: monospace;
  white-space: nowrap;
}

.template-purple-block .resume-entry-desc {
  font-size: 0.76rem;
  color: #333;
  line-height: 1.4;
  margin-top: 0.12rem;
  white-space: pre-line;
}

.template-purple-block .resume-project-tech {
  font-size: 0.72rem;
  color: #555;
  margin-top: 0.12rem;
}""",
    },
    {
        "id": 4,
        "name": "Navy Sidebar",
        "html_content": """<div class="resume-doc template-navy-sidebar">
  <div class="ns-main">
    <h1>{{name}}</h1>
    {{#if title}}<div class="ns-role">{{title}}</div>{{/if}}

    {{#if summary}}
    <div class="resume-section">
      <div class="resume-section-title">Summary</div>
      <p class="resume-entry-desc">{{summary}}</p>
    </div>
    {{/if}}

    {{#if experience.length}}
    <div class="resume-section">
      <div class="resume-section-title">Experience</div>
      {{#each experience}}
      <div class="resume-entry">
        <div class="resume-entry-top">
          <div>
            <div class="resume-entry-title">{{role}}</div>
            <div class="resume-entry-sub">{{company}}{{#if location}} &mdash; {{location}}{{/if}}</div>
          </div>
          <div class="resume-entry-date">{{duration}}</div>
        </div>
        {{#if description}}<div class="resume-entry-desc">{{description}}</div>{{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}

    {{#if projects.length}}
    <div class="resume-section">
      <div class="resume-section-title">Projects</div>
      {{#each projects}}
      <div class="resume-entry">
        <div class="resume-entry-top">
          <div class="resume-entry-title">{{name}}</div>
          {{#if link}}<a class="resume-entry-date ns-link" href="{{link}}" target="_blank" rel="noopener noreferrer">{{link}}</a>{{/if}}
        </div>
        {{#if technologies}}<div class="resume-project-tech"><strong>Technologies:</strong> {{technologies}}</div>{{/if}}
        {{#if description}}<div class="resume-entry-desc">{{description}}</div>{{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}
  </div>

  <div class="ns-sidebar">
    <div class="ns-sidebar-block">
      <div class="resume-section-title">Contact</div>
      {{#if email}}<div>{{email}}</div>{{/if}}
      {{#if phone}}<div>{{phone}}</div>{{/if}}
      {{#if location}}<div>{{location}}</div>{{/if}}
      {{#if linkedin}}<div><a class="ns-sidebar-link" href="https://{{linkedin}}" target="_blank" rel="noopener noreferrer">{{linkedin}}</a></div>{{/if}}
      {{#if website}}<div><a class="ns-sidebar-link" href="https://{{website}}" target="_blank" rel="noopener noreferrer">{{website}}</a></div>{{/if}}
    </div>

    {{#if skills.length}}
    <div class="ns-sidebar-block">
      <div class="resume-section-title">Skills</div>
      <ul class="qual-list">
        {{#each skills}}
        <li>{{this}}</li>
        {{/each}}
      </ul>
    </div>
    {{/if}}

    {{#if education.length}}
    <div class="ns-sidebar-block">
      <div class="resume-section-title">Education</div>
      {{#each education}}
      <div class="ns-edu-entry">
        <div class="resume-entry-title">{{degree}}</div>
        <div class="resume-entry-sub">{{school}}{{#if location}}, {{location}}{{/if}}</div>
        <div class="resume-entry-date">{{duration}}</div>
      </div>
      {{/each}}
    </div>
    {{/if}}

    {{#if certifications.length}}
    <div class="ns-sidebar-block">
      <div class="resume-section-title">Certifications</div>
      {{#each certifications}}
      <div class="ns-edu-entry">
        <div class="resume-entry-title">{{name}}</div>
        {{#if issuer}}<div class="resume-entry-sub">{{issuer}}</div>{{/if}}
        {{#if date}}<div class="resume-entry-date">{{date}}</div>{{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}
  </div>
</div>""",
        "css_content": """.template-navy-sidebar {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1a1a1a;
  width: 794px;
  height: 1123px;
  max-height: 1123px;
  margin: 0 auto;
  padding: 0;
  background: #fff;
  display: grid;
  grid-template-columns: 1fr 200px;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 1.4;
}

.template-navy-sidebar .ns-main {
  padding: 26px 24px;
}

.template-navy-sidebar .ns-main h1 {
  font-size: 1.55rem;
  font-weight: 700;
  color: #1e3a8a;
  margin: 0 0 0.15rem;
}

.template-navy-sidebar .ns-role {
  font-size: 0.82rem;
  color: #666;
  margin-bottom: 0.85rem;
  font-weight: 500;
}

.template-navy-sidebar .resume-section {
  margin-bottom: 0.8rem;
  break-inside: avoid;
}

.template-navy-sidebar .resume-section-title {
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #1e3a8a;
  border-bottom: 1px solid #dbeafe;
  padding-bottom: 0.18rem;
  margin-bottom: 0.4rem;
}

.template-navy-sidebar .resume-entry {
  margin-bottom: 0.6rem;
}

.template-navy-sidebar .resume-entry-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.template-navy-sidebar .resume-entry-title {
  font-weight: 700;
  font-size: 0.86rem;
  color: #111;
}

.template-navy-sidebar .resume-entry-sub {
  font-size: 0.76rem;
  color: #555;
}

.template-navy-sidebar .resume-entry-date {
  font-size: 0.7rem;
  color: #777;
  font-family: monospace;
  white-space: nowrap;
}

.template-navy-sidebar .resume-entry-desc {
  font-size: 0.76rem;
  color: #333;
  line-height: 1.4;
  margin-top: 0.12rem;
  white-space: pre-line;
}

.template-navy-sidebar .resume-project-tech {
  font-size: 0.72rem;
  color: #555;
  margin-top: 0.12rem;
}

.template-navy-sidebar .ns-link {
  color: #3b82f6;
  text-decoration: underline;
}

.template-navy-sidebar .ns-sidebar {
  background: #1e3a8a;
  color: #ffffff;
  padding: 26px 16px;
}

.template-navy-sidebar .ns-sidebar-block {
  margin-bottom: 1rem;
  font-size: 0.72rem;
  line-height: 1.5;
  color: rgba(255,255,255,0.85);
}

.template-navy-sidebar .ns-sidebar-block .resume-section-title {
  color: #93c5fd;
  border-color: rgba(255, 255, 255, 0.2);
}

.template-navy-sidebar .ns-sidebar-link {
  color: #93c5fd;
  text-decoration: underline;
  word-break: break-all;
}

.template-navy-sidebar .ns-sidebar .qual-list {
  list-style: disc;
  margin: 0;
  padding-left: 0.9rem;
  font-size: 0.72rem;
  display: block;
}

.template-navy-sidebar .ns-sidebar .qual-list li {
  margin-bottom: 0.2rem;
  color: #eff6ff;
}

.template-navy-sidebar .ns-edu-entry {
  margin-bottom: 0.5rem;
}

.template-navy-sidebar .ns-edu-entry .resume-entry-title {
  color: #ffffff;
  font-size: 0.78rem;
}

.template-navy-sidebar .ns-edu-entry .resume-entry-sub {
  color: #bfdbfe;
  font-size: 0.7rem;
}

.template-navy-sidebar .ns-edu-entry .resume-entry-date {
  color: #93c5fd;
  font-size: 0.66rem;
}""",
    },
    {
        "id": 5,
        "name": "Bold Minimalist",
        "html_content": """<div class="resume-doc template-bold-teal">
  <div class="bt-header">
    <h1>{{name}}</h1>
    {{#if title}}<div class="bt-job-title">{{title}}</div>{{/if}}
    <div class="bt-contact">
      {{#if email}}<span>{{email}}</span>{{/if}}
      {{#if phone}}<span> &bull; {{phone}}</span>{{/if}}
      {{#if location}}<span> &bull; {{location}}</span>{{/if}}
      {{#if linkedin}}<span> &bull; </span><a class="bt-link" href="https://{{linkedin}}" target="_blank" rel="noopener noreferrer">{{linkedin}}</a>{{/if}}
      {{#if website}}<span> &bull; </span><a class="bt-link" href="https://{{website}}" target="_blank" rel="noopener noreferrer">{{website}}</a>{{/if}}
    </div>
  </div>
  <div class="bt-rule"></div>

  {{#if summary}}
  <div class="resume-section">
    <div class="resume-section-title">Summary</div>
    <p class="resume-entry-desc">{{summary}}</p>
  </div>
  {{/if}}

  {{#if skills.length}}
  <div class="resume-section">
    <div class="resume-section-title">Skills</div>
    <ul class="qual-list">
      {{#each skills}}
      <li>{{this}}</li>
      {{/each}}
    </ul>
  </div>
  {{/if}}

  {{#if experience.length}}
  <div class="resume-section">
    <div class="resume-section-title">Experience</div>
    {{#each experience}}
    <div class="resume-entry">
      <div class="resume-entry-top">
        <div>
          <div class="resume-entry-title">{{role}}</div>
          <div class="resume-entry-sub">{{company}}{{#if location}} &mdash; {{location}}{{/if}}</div>
        </div>
        <div class="resume-entry-date">{{duration}}</div>
      </div>
      {{#if description}}<div class="resume-entry-desc">{{description}}</div>{{/if}}
    </div>
    {{/each}}
  </div>
  {{/if}}

  {{#if education.length}}
  <div class="resume-section">
    <div class="resume-section-title">Education</div>
    {{#each education}}
    <div class="resume-entry">
      <div class="resume-entry-top">
        <div>
          <div class="resume-entry-title">{{degree}}</div>
          <div class="resume-entry-sub">{{school}}{{#if location}} &mdash; {{location}}{{/if}}</div>
        </div>
        <div class="resume-entry-date">{{duration}}</div>
      </div>
    </div>
    {{/each}}
  </div>
  {{/if}}

  {{#if projects.length}}
  <div class="resume-section">
    <div class="resume-section-title">Projects</div>
    {{#each projects}}
    <div class="resume-entry">
      <div class="resume-entry-top">
        <div class="resume-entry-title">{{name}}</div>
        {{#if link}}<a class="resume-entry-date bt-link" href="{{link}}" target="_blank" rel="noopener noreferrer">{{link}}</a>{{/if}}
      </div>
      {{#if technologies}}<div class="resume-project-tech"><strong>Technologies:</strong> {{technologies}}</div>{{/if}}
      {{#if description}}<div class="resume-entry-desc">{{description}}</div>{{/if}}
    </div>
    {{/each}}
  </div>
  {{/if}}

  {{#if certifications.length}}
  <div class="resume-section">
    <div class="resume-section-title">Certifications</div>
    {{#each certifications}}
    <div class="resume-entry">
      <div class="resume-entry-top">
        <div>
          <div class="resume-entry-title">{{name}}</div>
          {{#if issuer}}<div class="resume-entry-sub">{{issuer}}</div>{{/if}}
        </div>
        {{#if date}}<div class="resume-entry-date">{{date}}</div>{{/if}}
      </div>
    </div>
    {{/each}}
  </div>
  {{/if}}
</div>""",
        "css_content": """.template-bold-teal {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1a1a1a;
  width: 794px;
  height: 1123px;
  max-height: 1123px;
  margin: 0 auto;
  padding: 28px 38px;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 1.4;
}

.template-bold-teal .bt-header h1 {
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #111827;
  margin: 0;
}

.template-bold-teal .bt-job-title {
  font-size: 0.84rem;
  color: #0f766e;
  font-weight: 500;
  margin-top: 2px;
}

.template-bold-teal .bt-contact {
  font-size: 0.74rem;
  color: #4b5563;
  margin-top: 0.2rem;
}

.template-bold-teal .bt-link {
  color: #0d9488;
  text-decoration: underline;
  text-underline-offset: 1px;
}

.template-bold-teal .bt-rule {
  height: 2.5px;
  background: #0d9488;
  margin: 0.5rem 0 0.85rem;
}

.template-bold-teal .resume-section {
  margin-bottom: 0.8rem;
  break-inside: avoid;
}

.template-bold-teal .resume-section-title {
  font-size: 0.76rem;
  font-weight: 700;
  color: #0f766e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #ccfbf1;
  padding-bottom: 0.18rem;
  margin-bottom: 0.4rem;
}

.template-bold-teal .qual-list {
  list-style: disc;
  margin: 0;
  padding-left: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.2rem 1rem;
  font-size: 0.78rem;
  color: #333;
}

.template-bold-teal .resume-entry {
  margin-bottom: 0.6rem;
}

.template-bold-teal .resume-entry-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.template-bold-teal .resume-entry-title {
  font-weight: 700;
  font-size: 0.86rem;
  color: #111;
}

.template-bold-teal .resume-entry-sub {
  font-size: 0.76rem;
  color: #4b5563;
}

.template-bold-teal .resume-entry-date {
  font-size: 0.7rem;
  color: #6b7280;
  font-family: monospace;
  white-space: nowrap;
}

.template-bold-teal .resume-entry-desc {
  font-size: 0.76rem;
  color: #374151;
  line-height: 1.4;
  margin-top: 0.12rem;
  white-space: pre-line;
}

.template-bold-teal .resume-project-tech {
  font-size: 0.72rem;
  color: #4b5563;
  margin-top: 0.12rem;
}""",
    },
    {
        "id": 6,
        "name": "Corporate Double Rule",
        "html_content": """<div class="resume-doc template-navy-double-rule">
  <div class="nd-header">
    <h1>{{name}}</h1>
    {{#if title}}<div class="nd-job-title">{{title}}</div>{{/if}}
  </div>
  <div class="nd-rule-group">
    <div class="nd-rule"></div>
    <div class="nd-contact">
      {{#if location}}<span>{{location}}</span>{{/if}}
      {{#if phone}}<span> &bull; {{phone}}</span>{{/if}}
      {{#if email}}<span> &bull; {{email}}</span>{{/if}}
      {{#if linkedin}}<span> &bull; </span><a class="nd-link" href="https://{{linkedin}}" target="_blank" rel="noopener noreferrer">{{linkedin}}</a>{{/if}}
      {{#if website}}<span> &bull; </span><a class="nd-link" href="https://{{website}}" target="_blank" rel="noopener noreferrer">{{website}}</a>{{/if}}
    </div>
    <div class="nd-rule"></div>
  </div>

  {{#if summary}}
  <div class="resume-section">
    <div class="resume-section-title">Summary</div>
    <p class="resume-entry-desc">{{summary}}</p>
  </div>
  {{/if}}

  {{#if skills.length}}
  <div class="resume-section">
    <div class="resume-section-title">Skills</div>
    <ul class="qual-list">
      {{#each skills}}
      <li>{{this}}</li>
      {{/each}}
    </ul>
  </div>
  {{/if}}

  {{#if experience.length}}
  <div class="resume-section">
    <div class="resume-section-title">Experience</div>
    {{#each experience}}
    <div class="resume-entry">
      <div class="resume-entry-top">
        <div>
          <div class="resume-entry-title">{{role}}</div>
          <div class="resume-entry-sub">{{company}}{{#if location}} &mdash; {{location}}{{/if}}</div>
        </div>
        <div class="resume-entry-date">{{duration}}</div>
      </div>
      {{#if description}}<div class="resume-entry-desc">{{description}}</div>{{/if}}
    </div>
    {{/each}}
  </div>
  {{/if}}

  {{#if education.length}}
  <div class="resume-section">
    <div class="resume-section-title">Education</div>
    {{#each education}}
    <div class="resume-entry">
      <div class="resume-entry-top">
        <div>
          <div class="resume-entry-title">{{degree}}</div>
          <div class="resume-entry-sub">{{school}}{{#if location}} &mdash; {{location}}{{/if}}</div>
        </div>
        <div class="resume-entry-date">{{duration}}</div>
      </div>
    </div>
    {{/each}}
  </div>
  {{/if}}

  {{#if projects.length}}
  <div class="resume-section">
    <div class="resume-section-title">Projects</div>
    {{#each projects}}
    <div class="resume-entry">
      <div class="resume-entry-top">
        <div class="resume-entry-title">{{name}}</div>
        {{#if link}}<a class="resume-entry-date nd-link" href="{{link}}" target="_blank" rel="noopener noreferrer">{{link}}</a>{{/if}}
      </div>
      {{#if technologies}}<div class="resume-project-tech"><strong>Technologies:</strong> {{technologies}}</div>{{/if}}
      {{#if description}}<div class="resume-entry-desc">{{description}}</div>{{/if}}
    </div>
    {{/each}}
  </div>
  {{/if}}

  {{#if certifications.length}}
  <div class="resume-section">
    <div class="resume-section-title">Certifications</div>
    {{#each certifications}}
    <div class="resume-entry">
      <div class="resume-entry-top">
        <div>
          <div class="resume-entry-title">{{name}}</div>
          {{#if issuer}}<div class="resume-entry-sub">{{issuer}}</div>{{/if}}
        </div>
        {{#if date}}<div class="resume-entry-date">{{date}}</div>{{/if}}
      </div>
    </div>
    {{/each}}
  </div>
  {{/if}}
</div>""",
        "css_content": """.template-navy-double-rule {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1a1a1a;
  width: 794px;
  height: 1123px;
  max-height: 1123px;
  margin: 0 auto;
  padding: 28px 38px;
  background: #fff;
  box-sizing: border-box;
  overflow: hidden;
  line-height: 1.4;
}

.template-navy-double-rule .nd-header {
  text-align: center;
  margin-bottom: 0.3rem;
}

.template-navy-double-rule .nd-header h1 {
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #1e3a8a;
  margin: 0;
}

.template-navy-double-rule .nd-job-title {
  font-size: 0.82rem;
  color: #2563eb;
  font-style: italic;
  margin-top: 2px;
}

.template-navy-double-rule .nd-rule-group {
  margin-bottom: 0.85rem;
}

.template-navy-double-rule .nd-rule {
  border-top: 1.5px solid #1e3a8a;
}

.template-navy-double-rule .nd-rule + .nd-contact {
  margin: 0.3rem 0;
}

.template-navy-double-rule .nd-contact {
  text-align: center;
  font-size: 0.74rem;
  color: #4b5563;
}

.template-navy-double-rule .nd-link {
  color: #1e3a8a;
  text-decoration: underline;
  text-underline-offset: 1px;
}

.template-navy-double-rule .resume-section {
  margin-bottom: 0.8rem;
  break-inside: avoid;
}

.template-navy-double-rule .resume-section-title {
  text-align: center;
  color: #1e3a8a;
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.18rem;
  margin-bottom: 0.4rem;
}

.template-navy-double-rule .qual-list {
  list-style: disc;
  margin: 0;
  padding-left: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.2rem 1rem;
  font-size: 0.78rem;
  color: #333;
}

.template-navy-double-rule .resume-entry {
  margin-bottom: 0.6rem;
}

.template-navy-double-rule .resume-entry-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.template-navy-double-rule .resume-entry-title {
  font-weight: 700;
  font-size: 0.86rem;
  color: #111;
}

.template-navy-double-rule .resume-entry-sub {
  font-size: 0.76rem;
  color: #4b5563;
}

.template-navy-double-rule .resume-entry-date {
  font-size: 0.7rem;
  color: #6b7280;
  font-family: monospace;
  white-space: nowrap;
}

.template-navy-double-rule .resume-entry-desc {
  font-size: 0.76rem;
  color: #374151;
  line-height: 1.4;
  margin-top: 0.12rem;
  white-space: pre-line;
}

.template-navy-double-rule .resume-project-tech {
  font-size: 0.72rem;
  color: #4b5563;
  margin-top: 0.12rem;
}""",
    },
]


class Command(BaseCommand):
    help = "Seed standard professional single-page resume templates into the database"

    def handle(self, *args, **options):
        count = 0
        for item in TEMPLATES_DATA:
            t, created = ResumeBuildTemplate.objects.update_or_create(
                id=item["id"],
                defaults={
                    "name": item["name"],
                    "html_content": item["html_content"],
                    "css_content": item["css_content"],
                    "is_active": True,
                },
            )
            count += 1
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{action} template: {t.name} (id={t.id})"))

        self.stdout.write(self.style.SUCCESS(f"Successfully processed {count} templates!"))
