import { Component, OnInit, ElementRef,ViewChild, AfterViewInit } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as $ from 'backbone';
import * as joint from 'jointjs';
import * as Diagram from 'diagram-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  @ViewChild('diagram1') diagram1: ElementRef;
  


  ngOnInit() {

    joint.shapes['html'] = {};
    joint.shapes['html'].Element = joint.shapes.basic.Rect.extend({
        defaults: joint.util.deepSupplement({
            type: 'html.Element',
            attrs: {
                rect: { stroke: 'white', 'fill-opacity': 0 }
            }
        }, joint.shapes.basic.Rect.prototype.defaults)
    });

    joint.shapes['html'].ElementView = joint.dia.ElementView.extend({

        template: [
            '<div class="html-element">',
            '<button class="delete">x</button>',
            '<span></span>', '<br/>',
            '<input type="text" value="Insert value" />',
            '</div>'
        ].join(''),

        initialize: function() {
            _.bindAll(this, ('updateBox'));
            joint.dia.ElementView.prototype.initialize.apply(this, arguments);

            this.$box = jQuery(_.template(this.template)());
            // Prevent paper from handling pointerdown.
            this.$box.find('input,select').on('mousedown click', function(evt) {
                evt.stopPropagation();
            });
            // This is an example of reacting on the input change and storing the input data in the cell model.
            this.$box.find('input').on('change', _.bind(function(evt) {
                this.model.set('input', jQuery(evt.target).val());
            }, this));
          
            this.$box.find('select').on('change', _.bind(function(evt) {
                this.model.set('select', jQuery(evt.target).val());
            }, this));
            this.$box.find('select').val(this.model.get('select'));
            this.$box.find('.delete').on('click', _.bind(this.model.remove, this.model));
            // Update the box position whenever the underlying model changes.
            this.model.on('change', this.updateBox, this);
            // Remove the box when the model gets removed from the graph.
            this.model.on('remove', this.removeBox, this);

            this.updateBox();
        },
        render: function() {
            joint.dia.ElementView.prototype.render.apply(this, arguments);
            this.paper.$el.prepend(this.$box);
            this.updateBox();
            return this;
        },
        updateBox: function() {
            // Set the position and dimension of the box so that it covers the JointJS element.
            var bbox = this.model.getBBox();
            // Example of updating the HTML with a data stored in the cell model.
            //this.$box.find('label').text(this.model.get('label'));
            this.$box.find('input').css({
                'pointer-events': 'auto'
            });
            this.$box.find('button').css({
                color: 'white',
                border: 'none',
                'background-color': '#C0392B',
                'border-radius': '20px',
                width: '15px',
                height: '15px',
                'line-height': '15px',
                'text-align': 'middle',
                'position': 'absolute',
                top: '-15px',
                left: '-15px',
                padding: 0,
                margin: 0,
                'font-weight': 'bold',
                cursor: 'pointer',
                'pointer-events': 'auto'

            });

            

            this.$box.css({
                left: bbox.x,
                top: bbox.y,
                transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)',
                position: 'absolute',
                background: '#3498DB',
                'pointer-events': 'none',
                '-webkit-user-select':' none',
                'border-radius': '4px',
                'border': '2px solid #2980B9',
                'box-shadow': 'inset 0 0 5px black, 2px 2px 1px gray',
                padding: '5px',
                'box-sizing': 'border-box',
                'z-index': 2,                 
            });
        },
        removeBox: function(evt) {
            this.$box.remove();
        }
    });

// Create JointJS elements and add them to the graph as usual.
// -----------------------------------------------------------

    var el1 = new joint.shapes['html'].Element({
        text: { text:
            '<input type="text" value="insert text" />'
            },
        position: { x: 80, y: 80 },
        size: { width: 170, height: 100 },
    });
    var el2 = new joint.shapes['html'].Element({
        position: { x: 370, y: 160 },
        size: { width: 170, height: 100 },
    });
    var l = new joint.dia.Link({
        source: { id: el1.id },
        target: { id: el2.id },
        attrs: { '.connection': { 'stroke-width': 5, stroke: '#34495E' } }
    });

    

    let graph = new joint.dia.Graph;

    let paper = new joint.dia.Paper({
      el: jQuery('#paper-html-elements'),
      width: 1200,
      height: 800,
      model: graph,
      gridSize: 1

    });

   
   graph.addCells([el1, el2, l]);

    

  }

  ngAfterViewInit() {


    // var diagram1 = new Diagram({ canvas: { container: this.diagram1.nativeElement }});
    //     diagram1.get('canvas').addShape({ id: 's1', type: 'red', x: 10, y: 20, width: 100, height: 100 });
         

  }
}
