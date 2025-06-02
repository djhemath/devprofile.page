import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as ejs from 'ejs';
import { DynamicFormComponent } from '../../../../components/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-site-details',
  imports: [DynamicFormComponent],
  templateUrl: './site-details.component.html',
  styleUrl: './site-details.component.scss'
})
export class SiteDetailsComponent implements OnInit {
  template = `
    <style>
      .highlight { outline: 2px solid #38bdf8; }

      .example-section {
        background-color: green !important;
        min-height: 100%;
      }
    </style>

    <section data-section="bio" class="example-section">
      <h2><%= content.name %></h2>
      <p><%= content.bio %></p>
    </section>

    <% if (content.projects) { %>
      <section data-section="projects">
        <% content.projects.forEach(p => { %>
          <div class="project">
            <h3><%= p.title %></h3>
            <p><%= p.description %></p>
          </div>
        <% }) %>
      </section>
    <% } %>
  `;

  previewHtml: SafeHtml = '';

  formConfig = [
    {
      "id": "name",
      "label": "Name",
      "type": "text",
      "placeholder": "Enter your full name",
      "defaultValue": "DJ Hemath",
      "required": true,
      "helpText": "Shown in the browser tab and SEO title"
    },
    {
      "id": "bio",
      "label": "Bio",
      "type": "textarea",
      "placeholder": "Tell us about yourself",
      "defaultValue": "Unorthodox software engineer",
      "required": false
    },
  ]

  data: any = {
    name: "DJ Hemath",
    bio: "Unorthodox software engineer",
  };

  constructor(
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.render();
  }

  render() {
    const compiled = ejs.render(this.template, { content: this.data});
    this.previewHtml = this.sanitizer.bypassSecurityTrustHtml(compiled);
  }

  onSave(data: any) {
    this.data = data;
    this.render();
  }

  onChange(data: any) {
    this.data = data;
    this.render();
  }
}
