import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import * as ejs from 'ejs';

import { DynamicFormComponent } from '../../../../components/dynamic-form/dynamic-form.component';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { escapeXML } from 'ejs';
import { convertFilesToDataURIs } from '../../../../shared/utils/file.util';

const temporaryStyles = [
  `.devprofilepage-field-highlight {outline: 2px dashed #38bdf8;}`,
];

@Component({
  selector: 'app-site-details',
  imports: [DynamicFormComponent, CommonModule],
  templateUrl: './site-details.component.html',
  styleUrl: './site-details.component.scss'
})
export class SiteDetailsComponent implements AfterViewInit {
  @ViewChild('previewIframe') previewIframe!: ElementRef<HTMLIFrameElement>;

  template = `    
    <html>
      <head>
        <style>
        </style>
      </head>
      <body>
      </body>
    </html>
  `;

  components: any = {
    header: `<h1>Heading! <%= content.name %> <%= option1 %></h1>`
  }

  previewHtml: string = '';

  styles: string[] = [];

  formConfig = []

  data: any = {
      "name": "DJ Hemath",
      "bio": "I'm a software engineer, space enthusiast and an occasional designer. I love to craft software products that improves people lives. I occasionally teach people some software concepts and guide whenever required.",
      "email": "hem@hemath.dev",
      "socials": [
        {
          "socialMedia": "github",
          "url": "https://github.com/djhemath"
        },
        {
          "socialMedia": "linkedin",
          "url": "https://linkedin.com/in/djhemath"
        },
        {
          "socialMedia": "twitter",
          "url": "https://x.com/djhemath"
        }
      ],
      "highlightedWords": [
        {
          "position": 3,
          "color": "#c0eaf3"
        },
        {
          "position": 4,
          "color": "#c0eaf3"
        },
        {
          "position": 10,
          "color": "#ffd9f0"
        },
        {
          "position": 23,
          "color": "#deffd9"
        }
      ],
      "talks": [
        {
          "topic": "Accessibility 101",
          "place": "Comcast",
          "isFutureTalk": true
        },
        {
          "topic": "A practical intro to WebAssembly",
          "place": "JS Lovers",
          "date": 1738434600000
        },
        {
          "topic": "React for beginners",
          "place": "Sysvine",
          "date": 1685644200000
        },
        {
          "topic": "Nostr - decentralized social media",
          "place": "NIT",
          "date": 1677695400000
        },
        {
          "topic": "GraphQL - deep dive",
          "place": "ESEC",
          "date": 1640889000000
        }
      ],
      "technologies": [
        {
          "name": "React",
          "image": "https://static.cdnlogo.com/logos/r/85/react.svg"
        },
        {
          "name": "React",
          "image": "https://static.cdnlogo.com/logos/r/85/react.svg"
        }
      ],
      "projects": [
        {
          "name": "SnapNostr",
          "description": "Give your Nostr notes a wonderful look it deserves!",
          "demoLink": "https://snapnostr.app"
        },
        {
          "name": "React comment system",
          "description": "An easy to configure comment system like Disqus, powered by Firebase",
          "demoLink": "https://github.com/djhemath/react-comment-system"
        }
      ]
    };
  
  // This is the original data that has raw File objects
  originalData = {}

  constructor() { }

  async ngAfterViewInit(): Promise<void> {
    try {
      const response = await fetch(`${environment.apiBaseUrl}/templates/info/djhemath/v1`)
      const templateResponse = await response.json();

      this.template = templateResponse.files['home.ejs'];
      this.styles = templateResponse.files['styles'] || [];
      this.formConfig = templateResponse.files['config'];
      this.render();
    } catch(err) {
      // TODO: Handle this error, maybe show a toast
      console.log(err);
    }
  }

  iframeSrc: SafeResourceUrl | null = null;

  updateIframe() {
    const iframe = this.previewIframe?.nativeElement;

    if (iframe && iframe.contentWindow?.document) {
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(this.previewHtml);

      const head = doc.head || doc.getElementsByTagName('head')[0];

      [...temporaryStyles, ...this.styles].forEach(_style => {
        const style = doc.createElement('style');
        style.innerHTML = _style;
        head.appendChild(style);
      });

      doc.close();
    }
  }

  render() {
    const fn = ejs.compile(this.template, {client: true});
    const compiled = fn({data: {content: this.data, meta: {title: "DJ Hemath - Software engineer"}}}, escapeXML, (path, d) => {
      return ejs.render(this.components[path], {content: this.data, ...d});
    });

    this.previewHtml = compiled;

    this.updateIframe();
  }

  onFocus(fieldId: string) {
    const iframe = this.previewIframe?.nativeElement;
    const doc = iframe?.contentWindow?.document;

    if (!doc) return;

    const target = doc.querySelector(`[data-section="${fieldId}"]`) as HTMLElement;

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });

      target.classList.add('devprofilepage-field-highlight');
    }
  }

  onBlur(fieldId: string) {
    const iframe = this.previewIframe?.nativeElement;
    const doc = iframe?.contentWindow?.document;

    if (!doc) return;

    const target = doc.querySelector(`[data-section="${fieldId}"]`) as HTMLElement;

    if (target) {
      target.classList.remove('devprofilepage-field-highlight');
    }
  }

  async onSave(data: any) {
    this.originalData = data;

    this.data = await convertFilesToDataURIs(data);
    this.render();
  }

  async onChange(data: any) {
    this.originalData = data;

    this.data = await convertFilesToDataURIs({...this.data, ...data});
    this.render();
  }
}
