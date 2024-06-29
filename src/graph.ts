


export class Graph {

	svg: SVGSVGElement;
	//ctx: SVGGElement;

    private moving = false;
    private evCache: PointerEvent[] = [];
    private evPrevCache: { [pointerId: number]: PointerEvent } = {};
    private lastDistance = -1;
    private resizeObserver: ResizeObserver;
    height = 0;
    width = 0;
    xOffset = 50;
    yOffset = 100;
    xScale = 1;
    yScale = 1;
    scrollSensitivity = 1.2;
    onRequestData: () => void = () => { };
    options = {
        background: '#111',
		initialZoom: 5,
        minZoom: 1,
		maxZoom: 100,
		minX: -100,
		maxX: 100,
		minY: -100,
		maxY: 100
    }

	constructor(svg: SVGSVGElement) {
		this.svg = svg;
		//this.ctx = svg.querySelector('.canvas') as SVGGElement;

		this.xScale = this.yScale = this.options.initialZoom;
        
		this.fixSize();
        // this.xOffset = this.width / 2;
        // this.yOffset = this.height / 2;
		this.svg.style.cursor = 'grab';
		this.svg.tabIndex = 0;
		this.svg.setAttribute('preserveAspectRatio', 'none');

        //pointer handlers
        this.svg.onpointerdown = (e) => this.onPointerDown(e);
        this.svg.onpointerup = (e) => this.onPointerUp(e);
		this.svg.onpointermove = (e) => this.onPointerMove(e);
		this.svg.onkeydown = e => this.onKeyDown(e);
		this.svg.oncontextmenu = e => {e.preventDefault(); return false}
        this.svg.addEventListener('wheel', (e) => {
            e.stopPropagation();
            e.preventDefault();
            this.zoom(e.deltaY, e.clientX, e.clientY);
        });

        //window.addEventListener('resize', this.fixSize);
		this.resizeObserver = new ResizeObserver((entries) => {
			if(entries.find(entry => entry.target === this.svg)) {//entry.contentBoxSize
				this.fixSize();
			}
		});

        this.resizeObserver.observe(this.svg);
	}
	
	//-------------------------------------- Public methods ---------------------------------------------

	zoomIn() {
		this.zoom(-100, this.width / 2, this.height / 2);
	}

	zoomOut() {
		this.zoom(100, this.width / 2, this.height / 2);
	}
	
	resetZoom() {
		this.xOffset = 50;
		this.yOffset = 100;
		this.xScale = this.yScale = this.options.initialZoom;
		this.draw();
	}

	fixSize() {
		this.width = this.svg.clientWidth;
		this.height = this.svg.clientHeight;
		// this.svg.setAttribute('width', this.width.toString());
		// this.svg.setAttribute('height', this.height.toString());
		// this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
		this.draw();
	}

	draw() {

		// //this.ctx.setAttribute('transform', ` translate(${this.xOffset / this.xScale}, ${this.yOffset / this.xScale})`);//scale(${this.xScale}, ${this.yScale})
		// this.ctx.style.scale = `${this.xScale}`;
		// this.ctx.style.translate = `${this.xOffset}px ${this.yOffset}px`;
		// this.svg.style.backgroundPosition = `${this.xOffset}px ${this.yOffset}px`;
		// //this.updateBackground(this.xScale, this.yScale);
		this.svg.setAttribute('viewBox', `${-this.xOffset / this.xScale} ${-this.yOffset / this.yScale} ${this.width / this.xScale} ${this.height / this.yScale}`);
	}

	// updateBackground(x: number, y: number) {

	// 	//this.svg.style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${sizeX * 2}' height='${sizeY * 2}' fill-opacity='.10' %3E%5C %3Crect x='${sizeX}' width='${sizeX}' height='${sizeY}' /%3E%5C %3Crect y='${sizeY}' width='${sizeX}' height='${sizeY}' /%3E%5C %3C/svg%3E")`;
	// 	this.svg.style.backgroundPosition = `${this.xOffset}px ${this.yOffset}px`;
	// }

	//-------------------------------------- Private methods ---------------------------------------------

	// Get distance between two touch points
    private getTouchDistance(x1: number, y1: number, x2: number, y2: number) {
        const a = Math.abs(x1 - x2);
        const b = Math.abs(y1 - y2);
        return Math.sqrt(a * a + b * b);
    }

	// Get center point of two touch points
    private getTouchCenter(x1: number, y1: number, x2: number, y2: number) {
        return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
    }

    private onPointerDown(e: PointerEvent) {
		//this.svg.setPointerCapture(e.pointerId);
        this.evCache.push(e);

        this.moving = true;
        this.evPrevCache[e.pointerId] = e;
        this.svg.style.cursor = 'grabbing';
    }

    private onPointerUp(e: PointerEvent) {
        if (this.moving) {
            this.moving = false;
            this.svg.style.cursor = 'grab';
        }
        this.svg.releasePointerCapture(e.pointerId);
        delete this.evPrevCache[e.pointerId];
        for (let i = 0; i < this.evCache.length; i++) {
            if (this.evCache[i]!.pointerId === e.pointerId) {
                this.evCache.splice(i, 1);
                break;
            }
        }
        if (this.evCache.length < 2) {
            this.lastDistance = -1;
            this.draw();
        }
    }

	private onPointerMove(e: PointerEvent) {
		if(!this.svg.hasPointerCapture(e.pointerId)) this.svg.setPointerCapture(e.pointerId);
        for (let i = 0; i < this.evCache.length; i++) {
            if (e.pointerId === this.evCache[i]!.pointerId) {
                this.evCache[i] = e;
                if (this.moving) {
                    const movementX = this.evCache[i]!.clientX - this.evPrevCache[e.pointerId]!.clientX;//this.prevX;
                    const movementY = this.evCache[i]!.clientY - this.evPrevCache[e.pointerId]!.clientY;//this.prevY;
                    //console.log(`movex:${movementX},movey${movementY}`);
                    this.move(movementX / this.evCache.length, movementY / this.evCache.length);
                }
                break;
            }
        }
        this.evPrevCache[e.pointerId] = e;

        if (this.evCache.length === 2) {
            // Calculate the distance between the two pointers
            const curDist = this.getTouchDistance(this.evCache[0]!.clientX, this.evCache[0]!.clientY, this.evCache[1]!.clientX, this.evCache[1]!.clientY);

            if (this.lastDistance > 0) {
                const center = this.getTouchCenter(this.evCache[0]!.clientX, this.evCache[0]!.clientY, this.evCache[1]!.clientX, this.evCache[1]!.clientY);
                this.zoom(curDist, center.x, center.y, true);
            }
            this.lastDistance = curDist;
        }
	}
	
	private onKeyDown(e: KeyboardEvent) {
		console.log(e.key)
		switch(e.key) {
			case 'ArrowLeft':
				this.move(30, 0);
				break;
			case 'ArrowRight':
				this.move(-30, 0);
				break;
			case 'ArrowUp':
				this.move(0, 30);
				break;
			case 'ArrowDown':
				this.move(0, -30);
				break;
			
			case '+':
				this.zoomIn();
				break;
			case '-':
				this.zoomOut();
				break;
		}
	}


    private move(x: number, y: number) {
        this.xOffset += x;
        this.yOffset += y;
		// this.ctx.translate(x, y);
		//this.svg.transform.baseVal.getItem(0).setTranslate(this.xOffset, this.yOffset);
		// this.svg.setAttribute('transform', `translate(${this.xOffset}, ${this.yOffset})`);

		// console.log('x:', this.xOffset, 'y:', this.yOffset);

		// const checkBounds = (variable: number, min: number, max: number) => {
		// 	if (variable > max) variable = max;
		// 	if (variable < min) variable = min;
		// 	return variable;
		// }

		// this.xOffset = checkBounds(this.xOffset, this.options.minX, this.options.maxX + this.width);
		// this.yOffset = checkBounds(this.yOffset, this.options.minY, this.options.maxY + this.height);
		
        this.draw();
    }

    private zoom(delta: number, x: number, y: number, touch = false) {
        
        const scale = touch ?
            delta / this.lastDistance : //for pinch zoom gestures
            delta < 0 ? this.scrollSensitivity : 1 / this.scrollSensitivity; //for mouse wheel
        
		const newXScale = this.xScale * scale;
		if (newXScale < this.options.maxZoom && newXScale > this.options.minZoom) {
			this.xScale = newXScale;//Math.round(this.xScale * scale * 100) / 100;
			this.xOffset = x - (x - this.xOffset) * scale;
		}
		const newYScale = this.yScale * scale;
		if (newYScale < this.options.maxZoom && newYScale > this.options.minZoom) {
			this.yScale = newYScale;//Math.round(this.yScale * scale * 100) / 100;
			this.yOffset = y - (y - this.yOffset) * scale;
		}
		
        this.draw();
        //console.log(`Xscale: ${this.xScale}, YScale: ${this.yScale}, x: ${x}, y: ${y}, gridx: ${this.getGridScale(this.xScale).scale}`);
    }
}
