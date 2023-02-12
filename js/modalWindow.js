let keyframes;
for (const iterator of document.styleSheets) {
  for (let i = 0; i < iterator.cssRules.length; i++) {
    // console.log(iterator.cssRules[i]);

    if (iterator.cssRules[i].name === "modalAnimationBlockDisable") {
      keyframes = iterator.cssRules[i].cssRules[0].style;
      break;
    }
  }
}
// console.log(keyframes);

const modalWindowsBox = document.getElementById("modal-window");
const modalBlur = document.getElementById("modal-window__block-blur");
// const modalButtonsClose = document.getElementsByClassName(
//   "modal-window__button-close"
// );
const modalWindowBlock = document.getElementsByClassName("modal-window__block");

for (const i of modalWindowBlock) {
  i.innerHTML +=
    '<button id="modal-window-button-close" class="modal-window__button-close"></button>';
}
const images = document.querySelectorAll(".modal-image");
const imagesF = [];

class DraggableBlock {
  On = false;
  top = 0;
  left = 0;
  constructor(element) {
    this.element = element;
    this.elementScale = 1;
    // this.xProcent = 0;
    // this.yProcent = 0;
    // this._moveMouse = this.moveMouse.bind(this);
    this._stopDrag = this.stopDrag.bind(this);
    this._drag = this.drag.bind(this);
    this.element.addEventListener("mousedown", this.startDrag.bind(this));
    this.a = 0;
  }

  startDrag(event) {
    if (!this.On) {
      // console.log("d");

      // this.element.style.transition = "0s";
      this.On = true;
      this.initialX = event.clientX;
      this.initialY = event.clientY;
      document.addEventListener("mouseup", this._stopDrag);
      document.addEventListener("mousemove", this._drag);
    }
  }

  drag(event) {
    // this.element.style.transform = `translateX(${
    //   event.clientX - this.initialX + "px"
    // }) translateY(${event.clientY - this.initialY + "px"}) `;
    // console.log(this.top + (event.clientY - this.initialY) + "px");
    // console.log(this.top);
    this.element.style.top = this.top + (event.clientY - this.initialY) + "px";
    this.element.style.left =
      this.left + (event.clientX - this.initialX) + "px";
  }

  stopDrag() {
    // console.log("s");
    this.On = false;
    this.top = Number.parseInt(this.element.style.top);
    this.left = Number.parseInt(this.element.style.left);
    document.removeEventListener("mouseup", this._stopDrag);
    document.removeEventListener("mousemove", this._drag);
    // this.element.style.transition = "0.2s";
  }
  // moveMouse(event) {
  //   this.xProcent =
  //     ((event.pageX - this.element.getBoundingClientRect().left) /
  //       this.element.getBoundingClientRect().width) *
  //     100;
  //   this.yProcent =
  //     ((event.pageY - this.element.getBoundingClientRect().top) /
  //       this.element.getBoundingClientRect().height) *
  //     100;
  // }
  scaleBlock(event) {
    let scaleFactor = 1.1;
    if (event.deltaY > 0) {
      scaleFactor = 0.9;
    }
    // console.log(`мышь ${event.clientX}px ${event.clientY}px`);
    // console.log(
    // //   event.pageX - this.element.getBoundingClientRect().left - this.a
    // // );
    // this.a = event.pageX - this.element.getBoundingClientRect().x;
    // console.log(this.xProcent, this.yProcent);
    // console.log(
    //   `${event.pageX - this.element.getBoundingClientRect().left}px ${
    //     event.pageY - this.element.getBoundingClientRect().top
    //   }px`
    // );

    // if (
    //   this.elementScale * scaleFactor < 800 &&
    //   this.elementHeight * scaleFactor < 540
    // ) {
    // console.log(this.elementScale * scaleFactor);
    // this.element.style.transformOrigin = `${
    //   event.pageX - this.element.getBoundingClientRect().left
    // }px ${event.pageY - this.element.getBoundingClientRect().top}px`;
    // this.element.style.transformOrigin = `${this.xProcent}% ${this.xProcent}%`;
    this.element.style.transform = `scale(${this.elementScale * scaleFactor})`;
    this.elementScale = this.elementScale * scaleFactor;
    // this.element.style.height = this.elementHeight * scaleFactor + "px";
    // this.elementHeight = this.elementHeight * scaleFactor;
    // }
  }
}

class ModalWindow {
  _On = false;
  _Off = false;
  _modalWindowBlock;
  _closeButton;
  static nowModalWindow = undefined;

  constructor(selector) {
    this._modalWindowBlock = document.querySelector(selector);
    this._closeButton = this._modalWindowBlock.querySelector(
      "#modal-window-button-close"
    );
    if (this._closeButton !== null) {
      // if
      this._closeButton.addEventListener("click", this.toggleOff.bind(this));
    }
  }
  toggleOn() {
    if (ModalWindow.nowModalWindow === undefined) {
      if (!this._On && !this._Off) {
        this._imgWatchOn();
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", this.toggleOff.bind(this));
        modalBlur.addEventListener("click", this.toggleOff.bind(this));

        modalWindowsBox.classList.add("modal-window-true");
        modalBlur.classList.add("modal-window-true-blur");
        this._modalWindowBlock.style.display = "block";
        this._modalWindowBlock.classList.add("modal-window__block-true");
        this._On = true;
        ModalWindow.nowModalWindow = this;
        setTimeout(() => {
          this._On = false;
          this._imgWatchOnEnd();
        }, 500);
      }
    }
  }
  toggleOff(e = { key: undefined }) {
    if (e.key == "Escape" || e.key === undefined) {
      // console.log("d");
      if (!this._On && !this._Off) {
        this._imgWatchOffFirst();
        document.removeEventListener("keydown", this.toggleOff.bind(this));
        modalBlur.removeEventListener("click", this.toggleOff.bind(this));

        this._modalWindowBlock.classList.add("modalAnimationBlockDisable");
        modalBlur.classList.add("modalAnimationBlurD");
        // butt.style.pointerEvents = "none";

        this._Off = true;
        document.body.style.overflow = "auto";

        setTimeout(
          function () {
            this._modalWindowBlock.style.display = "none";
            this._modalWindowBlock.classList.remove(
              "modalAnimationBlockDisable"
            );
            modalBlur.classList.remove("modalAnimationBlurD");
            modalWindowsBox.classList.remove("modal-window-true");
            modalBlur.classList.remove("modal-window-true-blur");
            this._modalWindowBlock.classList.remove("modal-window__block-true");

            this._Off = false;
            ModalWindow.nowModalWindow = undefined;
            this._imgWatchOff();
          }.bind(this),
          500
        );
      }
    }
  }
  _imgWatchOff() {}
  _imgWatchOffFirst() {}
  _imgWatchOn() {}
  _imgWatchOnEnd() {}
}

class ImageModalWindow extends ModalWindow {
  constructor(el, block) {
    super(".modal-window__block-img");
    this.element = el;
    // this.src = this.element.src;
    if (this._closeButton !== null) {
      this._closeButton.remove();
    }
    this.Block = block;
    this.blockScaleBlock = this.Block.scaleBlock.bind(this.Block);
    // this.Block = new DraggableBlock(this._modalWindowBlock, this.element);
    // this._closeButton.add('modal-window__button-image-close')

    // console.log(this._modalWindowBlock);
  }
  _imgWatchOn() {
    // this.Block.element.addEventListener("mousemove", this.Block._moveMouse);
    document.addEventListener("wheel", this.blockScaleBlock);

    // console.log(this.Block.element.querySelector("img").src);
    // console.log(this.src);
    // console.log(this.Block.element.offsetWidth);

    this.Block.element.querySelector("img").src = this.element.src;
    // this.Block.element.style.height = "450px";
  }
  _imgWatchOnEnd() {
    // this.Block.elementScale = 1;
    // this.Block.elementHeight = this.Block.element.offsetHeight;
  }
  _imgWatchOffFirst() {
    this.Block.element.style.transform = "";
    if (keyframes) {
      keyframes.transform = `scale(${this.Block.elementScale})`;
    }
    // this.Block.element.style.transition = "1s";
  }
  _imgWatchOff() {
    // this.Block.element.style.width = "auto";

    // this.Block.element.style.height = "80%";
    // this.Block.element.style.transition = "";

    document.removeEventListener("wheel", this.blockScaleBlock);
    // this.Block.element.removeEventListener("mousemove", this.Block._moveMouse);

    this.Block.element.style.top = "0";
    this.Block.element.style.left = "0";
    this.Block.top = 0;
    this.Block.left = 0;
    // setTimeout(
    //   function () {
    this.Block.elementScale = 1;
    //   }.bind(this),
    //   300
    // );
  }
}
const block = new DraggableBlock(
  document.querySelector(".modal-window__block-img")
);
images.forEach(function (i, id) {
  imagesF.push(new ImageModalWindow(i, block));
  i.addEventListener("click", imagesF[id].toggleOn.bind(imagesF[id]));
});
// modalW.toggleOn

// setTimeout(function () {
//   modalW.toggleOff();
// }, 2000);
