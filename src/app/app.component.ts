import { Component, ElementRef, ViewChild } from '@angular/core';
import { GameObject } from './game-object/game-object.component';
import KNN from 'ml-knn';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'crew-together'
  container = []
  amount = 20
  // dataset
  static dataset = []
  // label
  static label = []

  static iconSource = ['🔵', '🟢', '🟠']

  ngOnInit(): void {
    for (let i = 0; i < this.amount; i++) {
      const type = Math.floor(Math.random() * 3)
      const gameObject = this.genGameObject(i, type)
      AppComponent.label.push(type)
      AppComponent.dataset.push(gameObject)
      this.container.push(gameObject)
    }
  }

  genGameObject(seq: number, type: number) {
    return {
      seq: seq,
      type: type,
      x: Math.floor(Math.random() * 300),
      y: Math.floor(Math.random() * 300)
    }
  }

  detectOthers(gameObject) {
    let train_dataset = []
    let train_label = []
    for (const data of AppComponent.dataset) {
      if (data.seq != gameObject.seq) {
        train_dataset.push([data.x, data.y])
        train_label.push([data.type])
      }
    }
    const knn = new KNN(train_dataset, train_label, { k: 3 })
    const test_dataset = [[gameObject.x, gameObject.y]]
    // 取得最近點的屬性與位置
    const nearest_nodes = knn.kdTree.nearest([gameObject.x, gameObject.y], 1)
    let distance = 99999
    for(const node of nearest_nodes){
      
    }

    const mode = knn.predict(test_dataset) // 最近3個點的屬性眾數
    return {
      mode: mode[0][0],
      nearest_node: {
        type: nearest_nodes[0][0][2],
        x: nearest_nodes[0][0][0],
        y: nearest_nodes[0][0][1],
        dis: nearest_nodes[0][1]
      }
    }
  }

  moveStyle(gameObject): any {
    const ai = this.detectOthers(gameObject)
    const moveX = ai.nearest_node.x - gameObject.x > 0 ? 1 : -1
    const moveY = ai.nearest_node.y - gameObject.y > 0 ? 1 : -1
    let type = 99
    switch (gameObject.type) {
      case 0: {
        type = 10
        break
      }
      case 1: {
        type = 1
        break
      }
      case 2: {
        type = 2
        break
      }
    }

    if (ai.nearest_node.dis <= 15) {
      if (gameObject.type < ai.nearest_node.type) {
        gameObject.type = ai.nearest_node.type
      }
    }

    if (type > ai.nearest_node.type) {
      return { moveX: moveX * 2, moveY: moveY * 2 }
    } else {
      return { moveX: -moveX, moveY: -moveY }
    }
  }

  start() {
    setInterval(() => {
      for (const gameObject of this.container) {
        const movement = this.moveStyle(gameObject)
        gameObject.x = gameObject.x + movement.moveX
        gameObject.y = gameObject.y + movement.moveY
      }
    }, 100)

    // for (const gameObject of this.container) {
    //   const movement = this.moveStyle(gameObject)
    //   gameObject.x = gameObject.x + movement.moveX
    //   gameObject.y = gameObject.y + movement.moveY
    // }
  }





}
