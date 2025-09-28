import {Component, input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {Technology} from '../../../../models/technology.model.js';

@Component({
  selector: 'app-technology-panel',
  imports: [
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle
  ],
  template: `
    <mat-expansion-panel #panel hideToggle>
      <mat-expansion-panel-header>
        <mat-panel-title>{{technology().name}}</mat-panel-title>
        <mat-panel-description>{{technology().classification}}</mat-panel-description>
      </mat-expansion-panel-header>
      <p class="description-label">Technology description:</p>
      <p>{{technology().technologyDescription}}</p>
      @if (technology().classificationDescription) {
        <p class="description-label">Classification description:</p>
        <p>{{technology().classificationDescription}}</p>
      }
    </mat-expansion-panel>
  `,
  styles: `
    button {
      margin-right: 10px;
    }
    .description-label {
      font-weight: bold;
    }
    :host {
      display: block;
      margin-bottom: 10px;
    }
  `,
  standalone: true
})
export class TechnologyPanel implements OnChanges {
  technology = input.required<Technology>();
  highlight = input<boolean>();

  @ViewChild('panel') panel!: MatExpansionPanel;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['highlight'] && !changes['highlight'].firstChange) {
      this.applyHighlight();
    }
  }

  private applyHighlight() {
    if (this.highlight() && this.panel) {
      this.panel.open();

      setTimeout(() => {
        this.panel._body.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
      });
    } else if (!this.highlight() && this.panel) {
      this.panel.close();
    }
  }
}
