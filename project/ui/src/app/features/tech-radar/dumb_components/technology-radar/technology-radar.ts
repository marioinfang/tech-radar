import {Component, effect, input, OnInit, output} from '@angular/core';
import {Technology} from '../../../../models/technology.model';
import * as d3 from 'd3';
import {TechCategory} from '../../../../models/tech-category.enum';
import {TechClassification} from '../../../../models/tech-classification.enum';

interface TechNode extends d3.SimulationNodeDatum {
  id?: string;
  label: string;
  quadrant: number;
  ring: number;
  x?: number;
  y?: number;
  color?: string;
  segment?: Segment;
}

interface Segment {
  clipx(d: TechNode): number;
  clipy(d: TechNode): number;
  random(): { x: number; y: number };
}

@Component({
  selector: 'app-technology-radar',
  imports: [],
  template: `
    <div class="radar-container">
      <div class="radar"></div>
    </div>
  `,
  standalone: true
})
export class TechnologyRadar implements OnInit {
  technologies = input.required<Technology[]>();
  technologySelected = output<String>();

  radarQuadrants: { name: string, items: Technology[] }[] = [];

  constructor() {
    effect(() => {
      const techs = this.technologies();
      if (techs.length > 0) this.createTechRadar(techs);
    });
  }

  ngOnInit() {
    window.addEventListener('resize', () => {
      d3.select('.radar svg').remove();
      this.createTechRadar(this.technologies());
    });
  }

  createTechRadar(entries: Technology[]): void {
    const container = document.querySelector('.radar') as HTMLElement;
    console.log(`test height: ${container.offsetHeight} width: ${container.offsetWidth}`);
    const radarSize = Math.min(container.offsetWidth, window.innerHeight * 0.8);

    const config: any = {
      width: radarSize,
      height: radarSize,
      colors: { background: '#faf9fd', grid: '#dddde0', inactive: '#ddd' },
      rings: [
        { radius: radarSize * 0.16, name: 'Adopt', color: '#93c47d' },
        { radius: radarSize * 0.27, name: 'Trial', color: '#f9cb9c' },
        { radius: radarSize * 0.39, name: 'Assess', color: '#ffe599' },
        { radius: radarSize * 0.50, name: 'Hold', color: '#ea9999' }
      ],
      quadrants: [
        { name: 'Techniques' },
        { name: 'Tools' },
        { name: 'Frameworks' },
        { name: 'Platforms' },
      ]
    };

    const svg = this.createSvg(config);

    this.drawRings(svg, config);
    this.drawQuadrantLines(svg, config);
    this.drawQuadrantLabels(svg, config);

    const techNodes = this.mapTechnologiesToTechNodes(entries, config);

    this.radarQuadrants = this.groupByQuadrant(techNodes, config);

    const tooltip = this.createTooltip();

    const blips = this.drawBlips(svg, techNodes, tooltip);

    this.runForceSimulation(techNodes, blips);
  }

  private createSvg(config: any) {
    return d3.select('.radar')
      .append('svg')
      .attr('width', config.width)
      .attr('height', config.height)
      .style('background-color', config.colors.background)
      .append('g')
      .attr('transform', `translate(${config.width / 2},${config.height / 2})`);
  }

  private drawRings(svg: any, config: any) {
    config.rings.forEach((ring: any) => {
      svg.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', ring.radius)
        .attr('fill', 'none')
        .attr('stroke', config.colors.grid)
        .attr('stroke-width', 1);

      svg.append('text')
        .text(ring.name)
        .attr('x', 0)
        .attr('y', -ring.radius + 20)
        .attr('text-anchor', 'middle')
        .style('fill', ring.color)
        .style('font-size', '14px')
        .style('font-weight', 'bold');
    });
  }

  private drawQuadrantLines(svg: any, config: any) {
    const lines = [
      { x1: 0, y1: 0, x2: config.width / 2, y2: 0 },
      { x1: 0, y1: 0, x2: -config.width / 2, y2: 0 },
      { x1: 0, y1: 0, x2: 0, y2: config.height / 2 },
      { x1: 0, y1: 0, x2: 0, y2: -config.height / 2 }
    ];

    lines.forEach(line => {
      svg.append('line')
        .attr('x1', line.x1)
        .attr('y1', line.y1)
        .attr('x2', line.x2)
        .attr('y2', line.y2)
        .attr('stroke', config.colors.grid)
        .attr('stroke-width', 1);
    });
  }

  private drawQuadrantLabels(svg: any, config: any) {
    function cartesian(polar: { t: number; r: number }) {
      return { x: polar.r * Math.cos(polar.t), y: polar.r * Math.sin(polar.t) };
    }

    config.quadrants.forEach((quad: any, i: number) => {
      const angle = (i * Math.PI / 2) + Math.PI / 4;
      const r = config.rings[3].radius + 40;
      const pos = cartesian({ t: angle, r });

      svg.append('text')
        .text(quad.name)
        .attr('x', pos.x)
        .attr('y', pos.y)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .style('fill', '#666');
    });
  }

  private mapTechnologiesToTechNodes(technologies: Technology[], config: any): TechNode[] {
    const quadrants = [
      { radial_min: 0, radial_max: 0.5, factor_x: 1, factor_y: 1 },
      { radial_min: 0.5, radial_max: 1, factor_x: -1, factor_y: 1 },
      { radial_min: -1, radial_max: -0.5, factor_x: -1, factor_y: -1 },
      { radial_min: -0.5, radial_max: 0, factor_x: 1, factor_y: -1 }
    ];

    function polar(cartesian: { x: number; y: number }) {
      return { t: Math.atan2(cartesian.y, cartesian.x), r: Math.sqrt(cartesian.x ** 2 + cartesian.y ** 2) };
    }

    function cartesian(polar: { t: number; r: number }) {
      return { x: polar.r * Math.cos(polar.t), y: polar.r * Math.sin(polar.t) };
    }

    function bounded_interval(value: number, min: number, max: number) {
      return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
    }

    function bounded_ring(polar: { t: number; r: number }, r_min: number, r_max: number) {
      return { t: polar.t, r: bounded_interval(polar.r, r_min, r_max) };
    }

    function bounded_box(point: { x: number; y: number }, min: { x: number; y: number }, max: { x: number; y: number }) {
      return { x: bounded_interval(point.x, min.x, max.x), y: bounded_interval(point.y, min.y, max.y) };
    }

    function segment(quadrant: number, ring: number): Segment {
      const polar_min = { t: quadrants[quadrant].radial_min * Math.PI, r: ring === 0 ? 30 : config.rings[ring - 1].radius };
      const polar_max = { t: quadrants[quadrant].radial_max * Math.PI, r: config.rings[ring].radius };
      const cartesian_min = { x: 15 * quadrants[quadrant].factor_x, y: 15 * quadrants[quadrant].factor_y };
      const cartesian_max = { x: config.rings[3].radius * quadrants[quadrant].factor_x, y: config.rings[3].radius * quadrants[quadrant].factor_y };

      function clipx(d: TechNode) {
        const c = bounded_box({ x: d.x!, y: d.y! }, cartesian_min, cartesian_max);
        const p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
        d.x = cartesian(p).x;
        return d.x;
      }

      function clipy(d: TechNode) {
        const c = bounded_box({ x: d.x!, y: d.y! }, cartesian_min, cartesian_max);
        const p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
        d.y = cartesian(p).y;
        return d.y;
      }

      function random() {
        const t = d3.randomUniform(polar_min.t, polar_max.t)();
        const r = d3.randomUniform(polar_min.r, polar_max.r)();
        return cartesian({ t, r });
      }

      return { clipx, clipy, random };
    }

    return technologies.map(entry => {
      const quad = Object.values(TechCategory).indexOf(entry.category) % 4;
      const ring = Object.values(TechClassification).indexOf(entry.classification!) % 4;
      const seg = segment(quad, ring);
      const pt = seg.random();
      return { ...entry, id: entry._id, quadrant: quad, ring, x: pt.x, y: pt.y, segment: seg, color: config.rings[ring].color, label: entry.name };
    });
  }

  private groupByQuadrant(nodes: TechNode[], config: any) {
    return config.quadrants.map((q: {name: string}, i: number) => ({
      name: q.name,
      items: nodes.filter(node => node.quadrant === i)
    }));
  }

  private createTooltip() {
    return d3.select('body')
      .append('div')
      .style('position', 'absolute')
      .style('background', '#333')
      .style('color', '#fff')
      .style('padding', '4px 8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', '9999');
  }

  private drawBlips(svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>, techNodes: TechNode[], tooltip: any) {
    return svg.selectAll<SVGCircleElement, TechNode>('.blip')
      .data(techNodes)
      .join('circle')
      .attr('class', 'blip')
      .attr('cx', d => d.x!)
      .attr('cy', d => d.y!)
      .attr('r', 8)
      .attr('fill', d => d.color ?? '#000')
      .on('mouseover', (event, d) => {
        tooltip.style('opacity', 1).html(d.label)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY + 10) + 'px');
      })
      .on('mousemove', (event) => {
        tooltip.style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY + 10) + 'px');
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      })
      .on('click', (event, d) => {
        this.technologySelected.emit(d.id!);
      });
  }

  private runForceSimulation(techNodes: TechNode[], blips: d3.Selection<SVGCircleElement, TechNode, SVGGElement, unknown>) {
    return d3.forceSimulation(techNodes)
      .force('x', d3.forceX(d => d.x!).strength(0.5))
      .force('y', d3.forceY(d => d.y!).strength(0.5))
      .force('collide', d3.forceCollide(12).strength(0.8))
      .on('tick', () => {
        blips.attr('cx', d => d.segment!.clipx(d))
          .attr('cy', d => d.segment!.clipy(d));
      });
  }
}
