import { Component, DoCheck, Input, OnInit } from '@angular/core';
import KNN from 'ml-knn';
import { AppComponent } from '../app.component';

@Component({
  selector: 'gameObject',
  template: `<div [ngStyle]="getStyle()">{{ iconSource[gameObject.type] }}</div>`,
  styles: ['div{ position: absolute; }']
})
export class GameObject implements OnInit,DoCheck {  
  @Input() gameObject = {
    seq: '',
    type: 99,
    icon: '',
    x: 0,
    y: 0,
    radius: 0,
    moveStyle: ''
  }
  style: any
  moveStyle: any
  iconSource = ['🔵', '🟢', '🟠']
  icon = ''
  ngOnInit(): void {
    this.setPosition(this.gameObject.x, this.gameObject.y)
    this.icon = this.iconSource[this.gameObject.type]
  }

  ngDoCheck(): void {
    this.setPosition(this.gameObject.x, this.gameObject.y)
  }

  getNearMode() {
    let train_dataset = []
    let train_label = []
    for (const data of AppComponent.dataset) {
      if (data.seq != this.gameObject.seq) {
        train_dataset.push([data.x, data.y])
        train_label.push([data.label])
      }
    }
    const knn = new KNN(train_dataset, train_label, { k: 3 })
    const test_dataset = [[this.gameObject.x, this.gameObject.y]]
    // 取得最接近的三個點座標
    const nearest_nodes = knn.kdTree.nearest([this.gameObject.x, this.gameObject.y], knn.k)
    let x_avg = 0
    let y_avg = 0
    for (const node of nearest_nodes) {
      x_avg = x_avg + Math.round(node[0][0] / knn.k)
      y_avg = y_avg + Math.round(node[0][1] / knn.k)
    }
    const classify = knn.predict(test_dataset);
    return { classify: classify[0][0], node: { x: x_avg, y: y_avg } }
  }

  setPosition(x, y) {
    this.gameObject.x = x
    this.gameObject.y = y
    this.style = {
      'position': 'absolute',
      'left': x + 'px',
      'bottom': y + 'px',
    }
  }

  getStyle() {
    return this.style
  }


}
